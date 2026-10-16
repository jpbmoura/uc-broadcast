import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { isPermissionDenied } from "../../lib/errors";
import { db } from "../../lib/firebase";
import type { Connection } from "../../types/connection";
import { connectionConverter } from "./converter";

type Live<T> = { key: string; value: T; error: Error | null };

export const useConnections = (tenantId: string) => {
  const [live, setLive] = useState<Live<Connection[]> | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "connections").withConverter(connectionConverter),
      where("tenantId", "==", tenantId),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      q,
      (snapshot) =>
        setLive({
          key: tenantId,
          value: snapshot.docs.map((d) => d.data()),
          error: null,
        }),
      (error) => {
        console.error("[useConnections]", error);
        setLive({ key: tenantId, value: [], error });
      },
    );
  }, [tenantId]);

  const current = live?.key === tenantId ? live : null;
  return {
    data: current?.value ?? [],
    loading: current === null,
    error: current?.error ?? null,
  };
};

export const useConnection = (id: string) => {
  const [live, setLive] = useState<Live<Connection | null> | null>(null);

  useEffect(() => {
    const ref = doc(db, "connections", id).withConverter(connectionConverter);
    return onSnapshot(
      ref,
      (snapshot) =>
        setLive({ key: id, value: snapshot.data() ?? null, error: null }),
      (error) => {
        if (isPermissionDenied(error)) {
          setLive({ key: id, value: null, error: null });
        } else {
          console.error("[useConnection]", error);
          setLive({ key: id, value: null, error });
        }
      },
    );
  }, [id]);

  const current = live?.key === id ? live : null;
  return {
    data: current?.value ?? null,
    loading: current === null,
    error: current?.error ?? null,
  };
};

export const useConnectionContext = () => useOutletContext<Connection>();
