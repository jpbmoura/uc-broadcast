import { z } from "zod";

const email = z.email({ message: "Informe um e-mail válido" }).trim();

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Informe a senha"),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Informe seu nome")
      .max(80, "Use no máximo 80 caracteres"),
    email,
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
