import { z } from "zod";

const baseTilleggsopplysningerSchema = z.object({
  harFlereOpplysningerTilSoknaden: z.boolean().nullish(),
  tilleggsopplysningerTilSoknad: z.string().nullish(),
});

type BaseTilleggsopplysningerFormData = z.infer<
  typeof baseTilleggsopplysningerSchema
>;

function validerHarFlereOpplysningerPakrevd(
  data: BaseTilleggsopplysningerFormData,
) {
  return (
    data.harFlereOpplysningerTilSoknaden !== undefined &&
    data.harFlereOpplysningerTilSoknaden !== null
  );
}

function validerTilleggsopplysningerPakrevd(
  data: BaseTilleggsopplysningerFormData,
) {
  if (data.harFlereOpplysningerTilSoknaden) {
    return (
      data.tilleggsopplysningerTilSoknad &&
      data.tilleggsopplysningerTilSoknad.trim().length > 0
    );
  }
  return true;
}

export const tilleggsopplysningerSchema = baseTilleggsopplysningerSchema
  .transform((data) => ({
    ...data,
    // Clear tilleggsopplysninger field when harFlereOpplysningerTilSoknaden is false
    tilleggsopplysningerTilSoknad: data.harFlereOpplysningerTilSoknaden
      ? data.tilleggsopplysningerTilSoknad
      : undefined,
  }))
  .refine(validerHarFlereOpplysningerPakrevd, {
    message:
      "tilleggsopplysningerSteg.duMaSvarePaOmDuHarFlereOpplysningerTilSoknaden",
    path: ["harFlereOpplysningerTilSoknaden"],
  })
  .refine(validerTilleggsopplysningerPakrevd, {
    message:
      "tilleggsopplysningerSteg.tilleggsopplysningerErPakrevdNarDuHarFlereOpplysninger",
    path: ["tilleggsopplysningerTilSoknad"],
  });
