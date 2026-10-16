import { createContext, useContext } from "react";

export type Severity = "success" | "error" | "info" | "warning";
export type Notify = (message: string, severity?: Severity) => void;

export const NotifyContext = createContext<Notify | null>(null);

export const useNotify = () => {
  const notify = useContext(NotifyContext);
  if (!notify)
    throw new Error("useNotify precisa estar dentro de <NotifyProvider>");
  return notify;
};
