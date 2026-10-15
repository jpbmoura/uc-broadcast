import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";

export const ALICE = "alice";
export const BOB = "bob";

export const createEnv = () =>
  initializeTestEnvironment({
    projectId: "uc-broadcast",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });

export const dbAs = (env: RulesTestEnvironment, uid: string) =>
  env.authenticatedContext(uid).firestore();

export const dbAnon = (env: RulesTestEnvironment) =>
  env.unauthenticatedContext().firestore();

const past = Timestamp.fromDate(new Date("2026-01-01T12:00:00Z"));
const future = Timestamp.fromDate(new Date("2030-01-01T12:00:00Z"));
const recipient = {
  id: "contact-alice",
  name: "Maria",
  phone: "+5515999999999",
};

const fixtures: Record<string, Record<string, unknown>> = {
  "connections/conn-alice": {
    tenantId: ALICE,
    name: "Loja Alice",
    createdAt: past,
    updatedAt: past,
  },
  "connections/conn-bob": {
    tenantId: BOB,
    name: "Loja Bob",
    createdAt: past,
    updatedAt: past,
  },
  "contacts/contact-alice": {
    tenantId: ALICE,
    connectionId: "conn-alice",
    name: "Maria",
    phone: "+5515999999999",
    createdAt: past,
    updatedAt: past,
  },
  "messages/msg-scheduled": {
    tenantId: ALICE,
    connectionId: "conn-alice",
    body: "Promoção amanhã",
    recipients: [recipient],
    status: "scheduled",
    scheduledAt: future,
    sentAt: null,
    createdAt: past,
    updatedAt: past,
  },
  "messages/msg-sent": {
    tenantId: ALICE,
    connectionId: "conn-alice",
    body: "Bom dia",
    recipients: [recipient],
    status: "sent",
    scheduledAt: past,
    sentAt: past,
    createdAt: past,
    updatedAt: past,
  },
};

export const seedAll = (env: RulesTestEnvironment) =>
  env.withSecurityRulesDisabled(async (ctx) => {
    await Promise.all(
      Object.entries(fixtures).map(([path, data]) =>
        setDoc(doc(ctx.firestore(), path), data),
      ),
    );
  });

export const newConnection = (tenantId: string) => ({
  tenantId,
  name: "Nova conexão",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export const newContact = (tenantId: string, connectionId: string) => ({
  tenantId,
  connectionId,
  name: "João",
  phone: "+5511988887777",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export const newMessage = (tenantId: string, connectionId: string) => ({
  tenantId,
  connectionId,
  body: "Olá!",
  recipients: [recipient],
  status: "scheduled",
  sentAt: null,
  scheduledAt: future,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
