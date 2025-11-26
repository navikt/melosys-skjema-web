import { z } from "zod";

export const radgiverfirmaSchema = z.object({
  organisasjonsnummer: z
    .string()
    .min(1, "generellValidering.organisasjonsnummerErPakrevd")
    .regex(/^\d{9}$/, "generellValidering.organisasjonsnummerMaVare9Siffer"),
});

export type RadgiverfirmaFormData = z.infer<typeof radgiverfirmaSchema>;
