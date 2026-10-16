import { createContext } from "react";

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export type AuthState = {
  user: AppUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);
