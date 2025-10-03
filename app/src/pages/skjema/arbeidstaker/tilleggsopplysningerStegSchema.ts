import { z } from "zod";

const baseTilleggsopplysningerSchema = z.object({
  harFlereOpplysningerTilSoknaden: z.boolean({
    message:
      "tilleggsopplysningerSteg.duMaSvarePaOmDuHarFlereOpplysningerTilSoknaden",
  }),
  tilleggsopplysningerTilSoknad: z.string().optional(),
});

const validerTilleggsopplysningerPakrevd = (data: {
  harFlereOpplysningerTilSoknaden: boolean;
  tilleggsopplysningerTilSoknad?: string;
}) => {
  return !(
    data.harFlereOpplysningerTilSoknaden &&
    (!data.tilleggsopplysningerTilSoknad ||
      data.tilleggsopplysningerTilSoknad.trim() === "")
  );
};

export const tilleggsopplysningerSchema = baseTilleggsopplysningerSchema.refine(
  validerTilleggsopplysningerPakrevd,
  {
    message:
      "tilleggsopplysningerSteg.tilleggsopplysningerErPakrevdNarDuHarFlereOpplysninger",
    path: ["tilleggsopplysningerTilSoknad"],
  },
);
