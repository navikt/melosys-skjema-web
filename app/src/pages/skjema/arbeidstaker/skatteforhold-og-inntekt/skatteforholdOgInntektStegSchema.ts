import { z } from "zod";

function isValidBelop(belop?: string): boolean {
  if (!belop) return false;

  const normalized = belop.trim().replace(",", ".");
  const regex = /^\d+([.]\d+)?$/;

  if (!regex.test(normalized)) return false;

  const amount = Number.parseFloat(normalized);
  return amount > 0;
}

export const skatteforholdOgInntektSchema = z
  .object({
    erSkattepliktigTilNorgeIHeleutsendingsperioden: z.boolean({
      error:
        "skatteforholdOgInntektSteg.duMaSvarePaOmDuErSkattepliktigTilNorgeIHeleUtsendingsperioden",
    }),
    mottarPengestotteFraAnnetEosLandEllerSveits: z.boolean({
      error:
        "skatteforholdOgInntektSteg.duMaSvarePaOmDuMottarPengestotteFraEtAnnetEosLandEllerSveits",
    }),
    pengestotteSomMottasFraAndreLandBeskrivelse: z.string().optional(),
    landSomUtbetalerPengestotte: z.string().optional(),
    pengestotteSomMottasFraAndreLandBelop: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.mottarPengestotteFraAnnetEosLandEllerSveits) {
        return (
          data.pengestotteSomMottasFraAndreLandBeskrivelse &&
          data.pengestotteSomMottasFraAndreLandBeskrivelse.trim().length > 0
        );
      }
      return true;
    },
    {
      message:
        "skatteforholdOgInntektSteg.duMaBeskriveHvaSlagsPengestotteDuMottar",
      path: ["pengestotteSomMottasFraAndreLandBeskrivelse"],
    },
  )
  .refine(
    (data) => {
      if (data.mottarPengestotteFraAnnetEosLandEllerSveits) {
        return (
          data.landSomUtbetalerPengestotte &&
          data.landSomUtbetalerPengestotte.trim().length > 0
        );
      }
      return true;
    },
    {
      message:
        "skatteforholdOgInntektSteg.duMaVelgeHvilketLandSomUtbetalerPengestotten",
      path: ["landSomUtbetalerPengestotte"],
    },
  )
  .refine(
    (data) => {
      if (data.mottarPengestotteFraAnnetEosLandEllerSveits) {
        return isValidBelop(data.pengestotteSomMottasFraAndreLandBelop);
      }
      return true;
    },
    {
      message:
        "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
      path: ["pengestotteSomMottasFraAndreLandBelop"],
    },
  )
  .transform((data) => ({
    erSkattepliktigTilNorgeIHeleutsendingsperioden:
      data.erSkattepliktigTilNorgeIHeleutsendingsperioden,
    mottarPengestotteFraAnnetEosLandEllerSveits:
      data.mottarPengestotteFraAnnetEosLandEllerSveits,
    // Clear conditional fields when mottarPengestotteFraAnnetEosLandEllerSveits is false
    pengestotteSomMottasFraAndreLandBeskrivelse:
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? data.pengestotteSomMottasFraAndreLandBeskrivelse
        : undefined,
    landSomUtbetalerPengestotte:
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? data.landSomUtbetalerPengestotte
        : undefined,
    // Transform and normalize beløp
    pengestotteSomMottasFraAndreLandBelop:
      data.mottarPengestotteFraAnnetEosLandEllerSveits &&
      data.pengestotteSomMottasFraAndreLandBelop
        ? data.pengestotteSomMottasFraAndreLandBelop.trim().replace(",", ".")
        : undefined,
  }));
