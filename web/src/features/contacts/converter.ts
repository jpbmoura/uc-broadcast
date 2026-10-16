import type { FirestoreDataConverter } from "firebase/firestore";
import { toDate } from "../../lib/dates";
import type { Contact } from "../../types/contact";

export const contactConverter: FirestoreDataConverter<Contact> = {
  toFirestore: (contact) => contact,
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data({ ...options, serverTimestamps: "estimate" });
    return {
      id: snapshot.id,
      tenantId: data.tenantId,
      connectionId: data.connectionId,
      name: data.name,
      phone: data.phone,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  },
};
