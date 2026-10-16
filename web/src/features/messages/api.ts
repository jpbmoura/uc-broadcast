import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { Contact } from "../../types/contact";
import type { Recipient } from "../../types/message";

export type NewMessage = {
  body: string;
  recipients: Recipient[];
  scheduledAt: Date | null;
};

export const toRecipient = ({ id, name, phone }: Contact): Recipient => ({
  id,
  name,
  phone,
});

export const createMessage = (
  tenantId: string,
  connectionId: string,
  { body, recipients, scheduledAt }: NewMessage,
) =>
  addDoc(collection(db, "messages"), {
    tenantId,
    connectionId,
    body: body.trim(),
    recipients,
    status: "scheduled",
    scheduledAt: scheduledAt
      ? Timestamp.fromDate(scheduledAt)
      : serverTimestamp(),
    sentAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
