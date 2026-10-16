import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

const connectionsRef = collection(db, "connections");
const connectionRef = (id: string) => doc(db, "connections", id);

export const createConnection = (tenantId: string, name: string) =>
  addDoc(connectionsRef, {
    tenantId,
    name: name.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const renameConnection = (id: string, name: string) =>
  updateDoc(connectionRef(id), {
    name: name.trim(),
    updatedAt: serverTimestamp(),
  });

export const removeConnection = (id: string) => deleteDoc(connectionRef(id));
