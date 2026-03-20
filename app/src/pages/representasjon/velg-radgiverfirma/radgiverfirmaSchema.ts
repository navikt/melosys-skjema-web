import { z } from "zod";

import { organisasjonsnummerHarGyldigFormat } from "~/utils/valideringUtils.ts";

export const radgiverfirmaSchema = z.object({
  radgiverfirma: z.object(
    {
      orgnr: z
        .string()
        .min(1, "generellValidering.organisasjonsnummerErPakrevd")
        .refine(organisasjonsnummerHarGyldigFormat, {
          error: "generellValidering.organisasjonsnummerHarUgyldigFormat",
        }),
      navn: z.string(),
    },
    "velgRadgiverfirma.duMaSokeForstFeil",
  ),
});

export type RadgiverfirmaFormData = z.infer<typeof radgiverfirmaSchema>;
