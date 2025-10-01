import { z } from "zod";

const baseSkatteforholdOgInntektSchema = z.object({
  erSkattepliktigTilNorgeIHeleutsendingsperioden: z.boolean({
    message:
      "skatteforholdOgInntektSteg.duMaSvarePaOmDuErSkattepliktigTilNorgeIHeleUtsendingsperioden",
  }),
  mottarPengestotteFraAnnetEosLandEllerSveits: z.boolean({
    message:
      "skatteforholdOgInntektSteg.duMaSvarePaOmDuMottarPengestotteFraEtAnnetEosLandEllerSveits",
  }),
  pengestotteSomMottasFraAndreLandBeskrivelse: z.string().optional(),
  landSomUtbetalerPengestotte: z.string().optional(),
  pengestotteSomMottasFraAndreLandBelop: z.string().optional(),
});

type BaseSkatteforholdOgInntektFormData = z.infer<
  typeof baseSkatteforholdOgInntektSchema
>;

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
    if (
      !data.pengestotteSomMottasFraAndreLandBelop ||
      data.pengestotteSomMottasFraAndreLandBelop.trim().length === 0
    ) {
      return false;
    }
    const amount = Number.parseFloat(
      data.pengestotteSomMottasFraAndreLandBelop,
    );
    return !Number.isNaN(amount) && amount > 0;
  }
  return true;
}

export const skatteforholdOgInntektSchema = baseSkatteforholdOgInntektSchema
  .refine(validerPengestotteBeskrivelse, {
    message: "skatteforholdOgInntektSteg.duMaBeskriveHvaSlangsPengestotteDuMottar",
    path: ["pengestotteSomMottasFraAndreLandBeskrivelse"],
  })
  .refine(validerPengestotteLand, {
    message: "skatteforholdOgInntektSteg.duMaVelgeHvilketLandSomUtbetalerPengestotten",
    path: ["landSomUtbetalerPengestotte"],
  })
  .refine(validerPengestotteBelop, {
    message: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
    path: ["pengestotteSomMottasFraAndreLandBelop"],
  });