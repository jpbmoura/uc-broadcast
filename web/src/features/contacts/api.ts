import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { normalizePhone } from "../../lib/phone";
import type { ContactInput } from "../../types/contact";

const contactsRef = collection(db, "contacts");
const contactRef = (id: string) => doc(db, "contacts", id);

const clean = ({ name, phone }: ContactInput) => ({
  name: name.trim(),
  phone: normalizePhone(phone),
});

export const createContact = (
  tenantId: string,
  connectionId: string,
  input: ContactInput,
) =>
  addDoc(contactsRef, {
    tenantId,
    connectionId,
    ...clean(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const updateContact = (id: string, input: ContactInput) =>
  updateDoc(contactRef(id), {
    ...clean(input),
    updatedAt: serverTimestamp(),
  });

export const removeContact = (id: string) => deleteDoc(contactRef(id));
