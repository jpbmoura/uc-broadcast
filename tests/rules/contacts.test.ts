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
  newContact,
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

const aliceContact = () => doc(dbAs(env, ALICE), "contacts/contact-alice");
const contactsAs = (uid: string) => collection(dbAs(env, uid), "contacts");

describe("contacts: leitura", () => {
  test("dona lê o próprio contato", () =>
    assertSucceeds(getDoc(aliceContact())));

  test("outro usuário não lê", () =>
    assertFails(getDoc(doc(dbAs(env, BOB), "contacts/contact-alice"))));

  test("deslogado não lê", () =>
    assertFails(getDoc(doc(dbAnon(env), "contacts/contact-alice"))));

  test("lista filtrada pelo próprio tenantId funciona", () =>
    assertSucceeds(
      getDocs(query(contactsAs(ALICE), where("tenantId", "==", ALICE))),
    ));

  test("lista sem filtro é negada", () =>
    assertFails(getDocs(contactsAs(ALICE))));

  test("lista filtrando o tenantId de outro é negada", () =>
    assertFails(
      getDocs(query(contactsAs(ALICE), where("tenantId", "==", BOB))),
    ));
});

describe("contacts: criação", () => {
  test("cria em nome próprio na própria conexão", () =>
    assertSucceeds(
      addDoc(contactsAs(ALICE), newContact(ALICE, "conn-alice")),
    ));

  test("não cria em nome de outro", () =>
    assertFails(addDoc(contactsAs(ALICE), newContact(BOB, "conn-alice"))));

  test("não cria em conexão de outro", () =>
    assertFails(addDoc(contactsAs(ALICE), newContact(ALICE, "conn-bob"))));

  test("não cria em conexão inexistente", () =>
    assertFails(
      addDoc(contactsAs(ALICE), newContact(ALICE, "conn-fantasma")),
    ));

  test("deslogado não cria", () =>
    assertFails(
      addDoc(
        collection(dbAnon(env), "contacts"),
        newContact(ALICE, "conn-alice"),
      ),
    ));

  test("não aceita campo extra", () =>
    assertFails(
      addDoc(contactsAs(ALICE), {
        ...newContact(ALICE, "conn-alice"),
        isAdmin: true,
      }),
    ));

  test("não aceita nome vazio", () =>
    assertFails(
      addDoc(contactsAs(ALICE), { ...newContact(ALICE, "conn-alice"), name: "" }),
    ));

  test("não aceita nome com mais de 80 caracteres", () =>
    assertFails(
      addDoc(contactsAs(ALICE), {
        ...newContact(ALICE, "conn-alice"),
        name: "a".repeat(81),
      }),
    ));

  test.each([
    ["sem +", "5511988887777"],
    ["começando com 0", "+0511988887777"],
    ["curto demais", "+1234567"],
    ["com letras", "+55119888abcd"],
  ])("não aceita telefone inválido (%s)", (_, phone) =>
    assertFails(
      addDoc(contactsAs(ALICE), { ...newContact(ALICE, "conn-alice"), phone }),
    ),
  );

  test("não aceita data gerada no cliente", () =>
    assertFails(
      addDoc(contactsAs(ALICE), {
        ...newContact(ALICE, "conn-alice"),
        createdAt: Timestamp.now(),
      }),
    ));
});

describe("contacts: edição e exclusão", () => {
  test("dona edita nome e telefone", () =>
    assertSucceeds(
      updateDoc(aliceContact(), {
        name: "Maria Silva",
        phone: "+5515988887777",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("outro usuário não edita", () =>
    assertFails(
      updateDoc(doc(dbAs(env, BOB), "contacts/contact-alice"), {
        name: "Hackeada",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não troca a conexão", () =>
    assertFails(
      updateDoc(aliceContact(), {
        connectionId: "conn-bob",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não troca o tenantId", () =>
    assertFails(
      updateDoc(aliceContact(), { tenantId: BOB, updatedAt: serverTimestamp() }),
    ));

  test("não grava telefone inválido", () =>
    assertFails(
      updateDoc(aliceContact(), {
        phone: "15999999999",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não aceita updatedAt gerado no cliente", () =>
    assertFails(
      updateDoc(aliceContact(), { name: "Maria", updatedAt: Timestamp.now() }),
    ));

  test("dona exclui", () => assertSucceeds(deleteDoc(aliceContact())));

  test("outro usuário não exclui", () =>
    assertFails(deleteDoc(doc(dbAs(env, BOB), "contacts/contact-alice"))));
});
