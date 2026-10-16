import { z } from "zod";

export const connectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome da conexão")
    .max(80, "Use no máximo 80 caracteres"),
});

export type ConnectionValues = z.infer<typeof connectionSchema>;
