import { z } from "zod";

const mottarIkkePengestotteSchema = z.object({
  erSkattepliktigTilNorgeIHeleutsendingsperioden: z.boolean(),
  mottarPengestotteFraAnnetEosLandEllerSveits: z.literal(false),
});

const mottarPengestotteSchema = z.object({
  erSkattepliktigTilNorgeIHeleutsendingsperioden: z.boolean(),
  mottarPengestotteFraAnnetEosLandEllerSveits: z.literal(true),
  pengestotteSomMottasFraAndreLandBeskrivelse: z
    .string()
    .min(
      1,
      "skatteforholdOgInntektSteg.duMaBeskriveHvaSlagsPengestotteDuMottar",
    ),
  landSomUtbetalerPengestotte: z
    .string()
    .min(
      1,
      "skatteforholdOgInntektSteg.duMaVelgeHvilketLandSomUtbetalerPengestotten",
    ),
  pengestotteSomMottasFraAndreLandBelop: z
    .string()
    .min(1, "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0")
    .transform((val) => val.trim().replace(",", "."))
    .refine(
      (val) => {
        // Allow formats: 123, 123.4, 123,4 (comma already normalized to dot in transform)
        const regex = /^\d+([.]\d+)?$/;
        if (!regex.test(val)) return false;
        const amount = Number.parseFloat(val);
        return amount > 0;
      },
      { message: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0" },
    ),
});

export const skatteforholdOgInntektSchema = z.discriminatedUnion(
  "mottarPengestotteFraAnnetEosLandEllerSveits",
  [mottarIkkePengestotteSchema, mottarPengestotteSchema],
);
