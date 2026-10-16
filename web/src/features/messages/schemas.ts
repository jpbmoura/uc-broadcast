import { z } from "zod";

export const SEND_MODES = ["now", "schedule"] as const;
export type SendMode = (typeof SEND_MODES)[number];

export const composerSchema = z
  .object({
    recipientIds: z
      .array(z.string())
      .min(1, "Selecione pelo menos um contato")
      .max(500, "Selecione no máximo 500 contatos"),
    body: z
      .string()
      .trim()
      .min(1, "Escreva a mensagem")
      .max(4096, "Use no máximo 4096 caracteres"),
    mode: z.enum(SEND_MODES),
    scheduledAt: z.date().nullable(),
  })
  .superRefine(({ mode, scheduledAt }, ctx) => {
    if (mode !== "schedule") return;
    if (!scheduledAt) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduledAt"],
        message: "Escolha a data e o horário",
      });
    } else if (scheduledAt.getTime() <= Date.now()) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduledAt"],
        message: "Escolha um horário no futuro",
      });
    }
  });

export type ComposerValues = z.infer<typeof composerSchema>;

export const emptyComposer: ComposerValues = {
  recipientIds: [],
  body: "",
  mode: "now",
  scheduledAt: null,
};
