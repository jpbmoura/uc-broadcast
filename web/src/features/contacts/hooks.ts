import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import type { Contact } from "../../types/contact";
import { contactConverter } from "./converter";

type Live<T> = { key: string; value: T; error: Error | null };

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
const byName = (a: Contact, b: Contact) => collator.compare(a.name, b.name);

export const useContacts = (tenantId: string, connectionId: string) => {
  const key = `${tenantId}/${connectionId}`;
  const [live, setLive] = useState<Live<Contact[]> | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "contacts").withConverter(contactConverter),
      where("tenantId", "==", tenantId),
      where("connectionId", "==", connectionId),
      orderBy("name"),
    );
    return onSnapshot(
      q,
      (snapshot) =>
        setLive({
          key: `${tenantId}/${connectionId}`,
          value: snapshot.docs.map((d) => d.data()).sort(byName),
          error: null,
        }),
      (error) => {
        console.error("[useContacts]", error);
        setLive({ key: `${tenantId}/${connectionId}`, value: [], error });
      },
    );
  }, [tenantId, connectionId]);

  const current = live?.key === key ? live : null;
  return {
    data: current?.value ?? [],
    loading: current === null,
    error: current?.error ?? null,
  };
};
