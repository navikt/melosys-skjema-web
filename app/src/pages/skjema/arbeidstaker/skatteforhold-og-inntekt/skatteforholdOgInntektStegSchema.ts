import { z } from "zod";

const baseSkatteforholdOgInntektSchema = z.object({
  erSkattepliktigTilNorgeIHeleutsendingsperioden: z.boolean().optional(),
  mottarPengestotteFraAnnetEosLandEllerSveits: z.boolean().optional(),
  pengestotteSomMottasFraAndreLandBeskrivelse: z.string().optional(),
  landSomUtbetalerPengestotte: z.string().optional(),
  pengestotteSomMottasFraAndreLandBelop: z
    .string()
    .optional()
    .transform((val) => val?.trim().replace(",", ".")),
});

type BaseSkatteforholdOgInntektFormData = z.infer<
  typeof baseSkatteforholdOgInntektSchema
>;

function validerErSkattepliktigPakrevd(
  data: BaseSkatteforholdOgInntektFormData,
) {
  return data.erSkattepliktigTilNorgeIHeleutsendingsperioden !== undefined;
}

function validerMottarPengestottePakrevd(
  data: BaseSkatteforholdOgInntektFormData,
) {
  return data.mottarPengestotteFraAnnetEosLandEllerSveits !== undefined;
}

function validerPengestotteBeskrivelse(
  data: BaseSkatteforholdOgInntektFormData,
) {
  if (data.mottarPengestotteFraAnnetEosLandEllerSveits) {
    return (
      data.pengestotteSomMottasFraAndreLandBeskrivelse &&
      data.pengestotteSomMottasFraAndreLandBeskrivelse.trim().length > 0
    );
  }
  return true;
}

function validerPengestotteLand(data: BaseSkatteforholdOgInntektFormData) {
  if (data.mottarPengestotteFraAnnetEosLandEllerSveits) {
    return (
      data.landSomUtbetalerPengestotte &&
      data.landSomUtbetalerPengestotte.trim().length > 0
    );
  }
  return true;
}

function validerPengestotteBelop(data: BaseSkatteforholdOgInntektFormData) {
  if (data.mottarPengestotteFraAnnetEosLandEllerSveits) {
    if (!data.pengestotteSomMottasFraAndreLandBelop) {
      return false;
    }
    // Allow formats: 123, 123.4, 123,4 (comma already normalized to dot in transform)
    // Reject multiple dots/commas or non-numeric characters
    const regex = /^\d+([.]\d+)?$/;
    if (!regex.test(data.pengestotteSomMottasFraAndreLandBelop)) {
      return false;
    }
    const amount = Number.parseFloat(
      data.pengestotteSomMottasFraAndreLandBelop,
    );
    return amount > 0;
  }
  return true;
}

export const skatteforholdOgInntektSchema = baseSkatteforholdOgInntektSchema
  .transform((data) => ({
    ...data,
    // Clear conditional fields when mottarPengestotteFraAnnetEosLandEllerSveits is false
    pengestotteSomMottasFraAndreLandBeskrivelse:
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? data.pengestotteSomMottasFraAndreLandBeskrivelse
        : undefined,
    landSomUtbetalerPengestotte:
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? data.landSomUtbetalerPengestotte
        : undefined,
    pengestotteSomMottasFraAndreLandBelop:
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? data.pengestotteSomMottasFraAndreLandBelop
        : undefined,
  }))
  .refine(validerErSkattepliktigPakrevd, {
    message:
      "skatteforholdOgInntektSteg.duMaSvarePaOmDuErSkattepliktigTilNorgeIHeleUtsendingsperioden",
    path: ["erSkattepliktigTilNorgeIHeleutsendingsperioden"],
  })
  .refine(validerMottarPengestottePakrevd, {
    message:
      "skatteforholdOgInntektSteg.duMaSvarePaOmDuMottarPengestotteFraEtAnnetEosLandEllerSveits",
    path: ["mottarPengestotteFraAnnetEosLandEllerSveits"],
  })
  .refine(validerPengestotteBeskrivelse, {
    message:
      "skatteforholdOgInntektSteg.duMaBeskriveHvaSlagsPengestotteDuMottar",
    path: ["pengestotteSomMottasFraAndreLandBeskrivelse"],
  })
  .refine(validerPengestotteLand, {
    message:
      "skatteforholdOgInntektSteg.duMaVelgeHvilketLandSomUtbetalerPengestotten",
    path: ["landSomUtbetalerPengestotte"],
  })
  .refine(validerPengestotteBelop, {
    message: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
    path: ["pengestotteSomMottasFraAndreLandBelop"],
  });
