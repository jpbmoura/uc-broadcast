import { useContext } from "react";
import { AuthContext, type AppUser } from "./auth-context";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return context;
};

export const useCurrentUser = (): AppUser => {
  const { user } = useAuth();
  if (!user)
    throw new Error("useCurrentUser só pode ser usado em rotas protegidas");
  return user;
};
