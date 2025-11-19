import { z } from "zod";

const harIkkeFlereOpplysningerSchema = z.object({
  harFlereOpplysningerTilSoknaden: z.literal(false),
});

const harFlereOpplysningerSchema = z.object({
  harFlereOpplysningerTilSoknaden: z.literal(true),
  tilleggsopplysningerTilSoknad: z
    .string()
    .min(
      1,
      "tilleggsopplysningerSteg.tilleggsopplysningerErPakrevdNarDuHarFlereOpplysninger",
    ),
});

export const tilleggsopplysningerSchema = z.discriminatedUnion(
  "harFlereOpplysningerTilSoknaden",
  [harIkkeFlereOpplysningerSchema, harFlereOpplysningerSchema],
);

export type TilleggsopplysningerFormData = z.infer<
  typeof tilleggsopplysningerSchema
>;
