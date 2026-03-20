import { z } from "zod";

export const tilleggsopplysningerSchema = z
  .object({
    harFlereOpplysningerTilSoknaden: z.boolean({
      error:
        "tilleggsopplysningerSteg.duMaSvarePaOmDuHarFlereOpplysningerTilSoknaden",
    }),
    tilleggsopplysningerTilSoknad: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.harFlereOpplysningerTilSoknaden ||
      !!data.tilleggsopplysningerTilSoknad?.trim(),
    {
      error:
        "tilleggsopplysningerSteg.tilleggsopplysningerErPakrevdNarDuHarFlereOpplysninger",
      path: ["tilleggsopplysningerTilSoknad"],
      when: () => true,
    },
  )
  .transform((data) => ({
    harFlereOpplysningerTilSoknaden: data.harFlereOpplysningerTilSoknaden,
    // Clear tilleggsopplysninger field when harFlereOpplysningerTilSoknaden is false
    tilleggsopplysningerTilSoknad: data.harFlereOpplysningerTilSoknaden
      ? data.tilleggsopplysningerTilSoknad
      : undefined,
  }));

export type TilleggsopplysningerFormData = z.infer<
  typeof tilleggsopplysningerSchema
>;
