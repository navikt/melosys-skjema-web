import { z } from "zod";

// Discriminated union for pengestøtte
const mottarIkkePengestotteSchema = z.object({
  mottarPengestotteFraAnnetEosLandEllerSveits: z.literal(false),
});

const mottarPengestotteSchema = z.object({
  mottarPengestotteFraAnnetEosLandEllerSveits: z.literal(true),
  pengestotteSomMottasFraAndreLandBeskrivelse: z
    .string()
    .min(1, "skatteforholdOgInntektSteg.duMaBeskriveHvaSlagsPengestotteDuMottar"),
  landSomUtbetalerPengestotte: z
    .string()
    .min(1, "skatteforholdOgInntektSteg.duMaVelgeHvilketLandSomUtbetalerPengestotten"),
  pengestotteSomMottasFraAndreLandBelop: z
    .string()
    .transform((val) => val.trim().replace(",", "."))
    .refine(
      (val) => {
        if (!val) return false;
        const regex = /^\d+([.]\d+)?$/;
        if (!regex.test(val)) return false;
        const amount = Number.parseFloat(val);
        return amount > 0;
      },
      {
        message:
          "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
      }
    ),
});

const pengestotteSchema = z.discriminatedUnion(
  "mottarPengestotteFraAnnetEosLandEllerSveits",
  [mottarIkkePengestotteSchema, mottarPengestotteSchema]
);

// Main schema combining skatteplikt and pengestøtte
export const skatteforholdOgInntektSchema = z
  .intersection(
    z.object({
      erSkattepliktigTilNorgeIHeleutsendingsperioden: z.boolean({
        message:
          "skatteforholdOgInntektSteg.duMaSvarePaOmDuErSkattepliktigTilNorgeIHeleUtsendingsperioden",
      }),
    }),
    pengestotteSchema
  )
  .transform((data) => ({
    erSkattepliktigTilNorgeIHeleutsendingsperioden:
      data.erSkattepliktigTilNorgeIHeleutsendingsperioden,
    mottarPengestotteFraAnnetEosLandEllerSveits:
      data.mottarPengestotteFraAnnetEosLandEllerSveits,
    pengestotteSomMottasFraAndreLandBeskrivelse:
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? data.pengestotteSomMottasFraAndreLandBeskrivelse
        : undefined,
    landSomUtbetalerPengestotte: data.mottarPengestotteFraAnnetEosLandEllerSveits
      ? data.landSomUtbetalerPengestotte
      : undefined,
    pengestotteSomMottasFraAndreLandBelop:
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? data.pengestotteSomMottasFraAndreLandBelop
        : undefined,
  }));
