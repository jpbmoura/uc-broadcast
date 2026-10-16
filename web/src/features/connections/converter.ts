import type { FirestoreDataConverter } from "firebase/firestore";
import { toDate } from "../../lib/dates";
import type { Connection } from "../../types/connection";

export const connectionConverter: FirestoreDataConverter<Connection> = {
  toFirestore: (connection) => connection,
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data({ ...options, serverTimestamps: "estimate" });
    return {
      id: snapshot.id,
      tenantId: data.tenantId,
      name: data.name,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  },
};
