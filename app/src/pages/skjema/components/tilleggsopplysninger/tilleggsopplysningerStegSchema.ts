import { z } from "zod";

// Discriminated union approach - clean and direct validation
const harFlereOpplysningerFalseSchema = z.object({
  harFlereOpplysningerTilSoknaden: z.literal(false),
});

const harFlereOpplysningerTrueSchema = z.object({
  harFlereOpplysningerTilSoknaden: z.literal(true),
  tilleggsopplysningerTilSoknad: z
    .string()
    .min(1, "tilleggsopplysningerSteg.tilleggsopplysningerErPakrevdNarDuHarFlereOpplysninger"),
});

export const tilleggsopplysningerSchema = z
  .discriminatedUnion("harFlereOpplysningerTilSoknaden", [
    harFlereOpplysningerFalseSchema,
    harFlereOpplysningerTrueSchema,
  ])
  .transform((data) => ({
    harFlereOpplysningerTilSoknaden: data.harFlereOpplysningerTilSoknaden,
    tilleggsopplysningerTilSoknad:
      data.harFlereOpplysningerTilSoknaden === true
        ? data.tilleggsopplysningerTilSoknad
        : undefined,
  }));

export type TilleggsopplysningerFormData = z.infer<
  typeof tilleggsopplysningerSchema
>;
