import { onAuthStateChanged, type User } from "firebase/auth";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { auth } from "../../lib/firebase";
import { AuthContext, type AppUser } from "./auth-context";

const toAppUser = (user: User | null): AppUser | null =>
  user
    ? { uid: user.uid, email: user.email, displayName: user.displayName }
    : null;

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (firebaseUser) => {
        setUser(toAppUser(firebaseUser));
        setLoading(false);
      }),
    [],
  );

  const refreshUser = useCallback(async () => {
    await auth.currentUser?.reload();
    setUser(toAppUser(auth.currentUser));
  }, []);

  const value = useMemo(
    () => ({ user, loading, refreshUser }),
    [user, loading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
