import { z } from "zod";
import { isValidPhone, normalizePhone } from "../../lib/phone";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome")
    .max(80, "Use no máximo 80 caracteres"),
  phone: z
    .string()
    .trim()
    .min(1, "Informe o telefone")
    .refine(
      (value) => isValidPhone(normalizePhone(value)),
      "Telefone inválido. Use DDD + número",
    ),
});

export type ContactValues = z.infer<typeof contactSchema>;
