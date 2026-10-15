import { afterAll, beforeAll, beforeEach, describe, test } from "vitest";
import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ALICE,
  BOB,
  createEnv,
  dbAnon,
  dbAs,
  newMessage,
  seedAll,
} from "./setup";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await createEnv();
});
beforeEach(async () => {
  await env.clearFirestore();
  await seedAll(env);
});
afterAll(async () => {
  await env.cleanup();
});

const recipient = { id: "contact-alice", name: "Maria", phone: "+5515999999999" };
const later = Timestamp.fromDate(new Date("2031-01-01T12:00:00Z"));

const aliceScheduled = () => doc(dbAs(env, ALICE), "messages/msg-scheduled");
const aliceSent = () => doc(dbAs(env, ALICE), "messages/msg-sent");
const messagesAs = (uid: string) => collection(dbAs(env, uid), "messages");
const aliceNew = () => newMessage(ALICE, "conn-alice");

describe("messages: leitura", () => {
  test("dona lê a própria mensagem", () =>
    assertSucceeds(getDoc(aliceScheduled())));

  test("outro usuário não lê", () =>
    assertFails(getDoc(doc(dbAs(env, BOB), "messages/msg-scheduled"))));

  test("deslogado não lê", () =>
    assertFails(getDoc(doc(dbAnon(env), "messages/msg-scheduled"))));

  test("lista filtrada pelo próprio tenantId funciona", () =>
    assertSucceeds(
      getDocs(query(messagesAs(ALICE), where("tenantId", "==", ALICE))),
    ));

  test("lista sem filtro é negada", () =>
    assertFails(getDocs(messagesAs(ALICE))));

  test("lista filtrando o tenantId de outro é negada", () =>
    assertFails(
      getDocs(query(messagesAs(ALICE), where("tenantId", "==", BOB))),
    ));
});

describe("messages: criação", () => {
  test("agenda em nome próprio", () =>
    assertSucceeds(addDoc(messagesAs(ALICE), aliceNew())));

  test("não cria em nome de outro", () =>
    assertFails(addDoc(messagesAs(ALICE), newMessage(BOB, "conn-alice"))));

  test("não cria em conexão de outro", () =>
    assertFails(addDoc(messagesAs(ALICE), newMessage(ALICE, "conn-bob"))));

  test("não cria em conexão inexistente", () =>
    assertFails(
      addDoc(messagesAs(ALICE), newMessage(ALICE, "conn-fantasma")),
    ));

  test("deslogado não cria", () =>
    assertFails(addDoc(collection(dbAnon(env), "messages"), aliceNew())));

  test("não aceita campo extra", () =>
    assertFails(addDoc(messagesAs(ALICE), { ...aliceNew(), priority: 1 })));

  test("não aceita campo faltando", () => {
    const { sentAt: _, ...withoutSentAt } = aliceNew();
    return assertFails(addDoc(messagesAs(ALICE), withoutSentAt));
  });

  test("não aceita corpo vazio", () =>
    assertFails(addDoc(messagesAs(ALICE), { ...aliceNew(), body: "" })));

  test("não aceita corpo com mais de 4096 caracteres", () =>
    assertFails(
      addDoc(messagesAs(ALICE), { ...aliceNew(), body: "a".repeat(4097) }),
    ));

  test("não aceita lista de destinatários vazia", () =>
    assertFails(addDoc(messagesAs(ALICE), { ...aliceNew(), recipients: [] })));

  test("não aceita mais de 500 destinatários", () =>
    assertFails(
      addDoc(messagesAs(ALICE), {
        ...aliceNew(),
        recipients: Array(501).fill(recipient),
      }),
    ));

  test("não aceita destinatários fora de lista", () =>
    assertFails(
      addDoc(messagesAs(ALICE), { ...aliceNew(), recipients: recipient }),
    ));

  test("não nasce como enviada", () =>
    assertFails(addDoc(messagesAs(ALICE), { ...aliceNew(), status: "sent" })));

  test("não nasce com sentAt preenchido", () =>
    assertFails(
      addDoc(messagesAs(ALICE), { ...aliceNew(), sentAt: Timestamp.now() }),
    ));

  test("não aceita scheduledAt que não seja timestamp", () =>
    assertFails(
      addDoc(messagesAs(ALICE), {
        ...aliceNew(),
        scheduledAt: "2030-01-01T12:00:00Z",
      }),
    ));

  test("não aceita data gerada no cliente", () =>
    assertFails(
      addDoc(messagesAs(ALICE), { ...aliceNew(), createdAt: Timestamp.now() }),
    ));
});

describe("messages: edição e exclusão", () => {
  test("dona edita mensagem agendada", () =>
    assertSucceeds(
      updateDoc(aliceScheduled(), {
        body: "Promoção remarcada",
        recipients: [recipient, { ...recipient, id: "c2" }],
        scheduledAt: later,
        updatedAt: serverTimestamp(),
      }),
    ));

  test("outro usuário não edita", () =>
    assertFails(
      updateDoc(doc(dbAs(env, BOB), "messages/msg-scheduled"), {
        body: "Hackeada",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não edita mensagem já enviada", () =>
    assertFails(
      updateDoc(aliceSent(), {
        body: "Corrigindo",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não marca como enviada", () =>
    assertFails(
      updateDoc(aliceScheduled(), {
        status: "sent",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não preenche sentAt", () =>
    assertFails(
      updateDoc(aliceScheduled(), {
        sentAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não troca a conexão", () =>
    assertFails(
      updateDoc(aliceScheduled(), {
        connectionId: "conn-bob",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não aceita corpo vazio", () =>
    assertFails(
      updateDoc(aliceScheduled(), { body: "", updatedAt: serverTimestamp() }),
    ));

  test("não aceita lista de destinatários vazia", () =>
    assertFails(
      updateDoc(aliceScheduled(), {
        recipients: [],
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não aceita updatedAt gerado no cliente", () =>
    assertFails(
      updateDoc(aliceScheduled(), { body: "Oi", updatedAt: Timestamp.now() }),
    ));

  test("dona exclui mensagem agendada", () =>
    assertSucceeds(deleteDoc(aliceScheduled())));

  test("dona exclui mensagem enviada", () =>
    assertSucceeds(deleteDoc(aliceSent())));

  test("outro usuário não exclui", () =>
    assertFails(deleteDoc(doc(dbAs(env, BOB), "messages/msg-scheduled"))));
});
