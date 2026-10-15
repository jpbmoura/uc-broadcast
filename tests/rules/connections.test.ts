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
  newConnection,
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

const aliceConn = () => doc(dbAs(env, ALICE), "connections/conn-alice");
const connectionsAs = (uid: string) =>
  collection(dbAs(env, uid), "connections");

describe("connections: leitura", () => {
  test("dona lê a própria conexão", () => assertSucceeds(getDoc(aliceConn())));

  test("outro usuário não lê", () =>
    assertFails(getDoc(doc(dbAs(env, BOB), "connections/conn-alice"))));

  test("deslogado não lê", () =>
    assertFails(getDoc(doc(dbAnon(env), "connections/conn-alice"))));

  test("lista filtrada pelo próprio tenantId funciona", () =>
    assertSucceeds(
      getDocs(query(connectionsAs(ALICE), where("tenantId", "==", ALICE))),
    ));

  test("lista sem filtro é negada", () =>
    assertFails(getDocs(connectionsAs(ALICE))));

  test("lista filtrando o tenantId de outro é negada", () =>
    assertFails(
      getDocs(query(connectionsAs(ALICE), where("tenantId", "==", BOB))),
    ));
});

describe("connections: criação", () => {
  test("cria em nome próprio", () =>
    assertSucceeds(addDoc(connectionsAs(ALICE), newConnection(ALICE))));

  test("não cria em nome de outro", () =>
    assertFails(addDoc(connectionsAs(ALICE), newConnection(BOB))));

  test("não aceita campo extra", () =>
    assertFails(
      addDoc(connectionsAs(ALICE), { ...newConnection(ALICE), isAdmin: true }),
    ));

  test("não aceita nome vazio", () =>
    assertFails(
      addDoc(connectionsAs(ALICE), { ...newConnection(ALICE), name: "" }),
    ));

  test("não aceita data gerada no cliente", () =>
    assertFails(
      addDoc(connectionsAs(ALICE), {
        ...newConnection(ALICE),
        createdAt: Timestamp.now(),
      }),
    ));
});

describe("connections: edição e exclusão", () => {
  test("dona renomeia", () =>
    assertSucceeds(
      updateDoc(aliceConn(), {
        name: "Loja Nova",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("outro usuário não renomeia", () =>
    assertFails(
      updateDoc(doc(dbAs(env, BOB), "connections/conn-alice"), {
        name: "Hackeada",
        updatedAt: serverTimestamp(),
      }),
    ));

  test("não troca o tenantId", () =>
    assertFails(
      updateDoc(aliceConn(), { tenantId: BOB, updatedAt: serverTimestamp() }),
    ));

  test("dona exclui", () => assertSucceeds(deleteDoc(aliceConn())));

  test("outro usuário não exclui", () =>
    assertFails(deleteDoc(doc(dbAs(env, BOB), "connections/conn-alice"))));
});
