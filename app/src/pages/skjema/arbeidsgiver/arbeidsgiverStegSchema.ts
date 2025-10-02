import { z } from "zod";

export const arbeidsgiverSchema = z.object({
  organisasjonsnummer: z
    .string()
    .min(1, "generellValidering.organisasjonsnummerErPakrevd")
    .regex(/^\d{9}$/, "generellValidering.organisasjonsnummerMaVare9Siffer"),
});
