import { z } from "zod";

export const radgiverfirmaSchema = z.object({
  radgiverfirma: z.object(
    {
      orgnr: z
        .string()
        .min(1, "generellValidering.organisasjonsnummerErPakrevd")
        .regex(
          /^\d{9}$/,
          "generellValidering.organisasjonsnummerMaVare9Siffer",
        ),
      navn: z.string(),
    },
    "velgRadgiverfirma.duMaSokeForstFeil",
  ),
});

export type RadgiverfirmaFormData = z.infer<typeof radgiverfirmaSchema>;
