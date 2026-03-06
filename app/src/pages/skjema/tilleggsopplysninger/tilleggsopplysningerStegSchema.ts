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
    (data) => {
      if (data.harFlereOpplysningerTilSoknaden) {
        return (
          data.tilleggsopplysningerTilSoknad &&
          data.tilleggsopplysningerTilSoknad.trim().length > 0
        );
      }
      return true;
    },
    {
      message:
        "tilleggsopplysningerSteg.tilleggsopplysningerErPakrevdNarDuHarFlereOpplysninger",
      path: ["tilleggsopplysningerTilSoknad"],
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
