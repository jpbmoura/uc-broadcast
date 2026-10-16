import type { FirestoreDataConverter } from "firebase/firestore";
import { toDate } from "../../lib/dates";
import type { Message, Recipient } from "../../types/message";

const toRecipients = (value: unknown): Recipient[] =>
  Array.isArray(value)
    ? value.map((item) => ({
        id: String(item.id),
        name: String(item.name),
        phone: String(item.phone),
      }))
    : [];

export const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: (message) => message,
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data({ ...options, serverTimestamps: "estimate" });
    return {
      id: snapshot.id,
      tenantId: data.tenantId,
      connectionId: data.connectionId,
      body: data.body,
      recipients: toRecipients(data.recipients),
      status: data.status === "sent" ? "sent" : "scheduled",
      scheduledAt: toDate(data.scheduledAt),
      sentAt: data.sentAt ? toDate(data.sentAt) : null,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  },
};
