import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { AUTH_ERRORS } from "../../helpers/enums/auth-erros";

export type SignUpInput = { name: string; email: string; password: string };
export type SignInInput = { email: string; password: string };

export const signUp = async ({ name, email, password }: SignUpInput) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  return user;
};

export const signIn = ({ email, password }: SignInInput) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOut = () => firebaseSignOut(auth);

export const authErrorMessage = (error: unknown) =>
  error instanceof FirebaseError
    ? (AUTH_ERRORS[error.code] ?? "Não foi possível concluir. Tente novamente.")
    : "Erro inesperado. Tente novamente.";
