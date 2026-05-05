import { z } from "zod";

/** Gyldig beløp: positive kroner med øre (2 desimal plasser), eksempel: 1000,00 */
const BELOP_REGEX = /^\d+,\d{2}$/;

function erGyldigBelop(belop?: string): boolean {
  if (!belop) return false;
  return BELOP_REGEX.test(belop.trim().replaceAll(/\s/g, ""));
}

const checkboxGroupSchema = z.record(z.string(), z.boolean()).optional();

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
    arbeidsinntektFraNorskEllerUtenlandskVirksomhet: checkboxGroupSchema,
    hvilkeTyperInntektHarDu: checkboxGroupSchema,
    inntekterFraUtenlandskVirksomhet: z.string().optional(),
    inntekterFraEgenVirksomhet: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.mottarPengestotteFraAnnetEosLandEllerSveits ||
      !!data.pengestotteSomMottasFraAndreLandBeskrivelse?.trim(),
    {
      error:
        "skatteforholdOgInntektSteg.duMaBeskriveHvaSlagsPengestotteDuMottar",
      path: ["pengestotteSomMottasFraAndreLandBeskrivelse"],
      when: () => true,
    },
  )
  .refine(
    (data) =>
      !data.mottarPengestotteFraAnnetEosLandEllerSveits ||
      !!data.landSomUtbetalerPengestotte?.trim(),
    {
      error:
        "skatteforholdOgInntektSteg.duMaVelgeHvilketLandSomUtbetalerPengestotten",
      path: ["landSomUtbetalerPengestotte"],
      when: () => true,
    },
  )
  .refine(
    (data) =>
      !data.mottarPengestotteFraAnnetEosLandEllerSveits ||
      !!data.pengestotteSomMottasFraAndreLandBelop?.trim(),
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
      path: ["pengestotteSomMottasFraAndreLandBelop"],
      when: () => true,
    },
  )
  .refine(
    (data) =>
      !data.mottarPengestotteFraAnnetEosLandEllerSveits ||
      !data.pengestotteSomMottasFraAndreLandBelop?.trim() ||
      erGyldigBelop(data.pengestotteSomMottasFraAndreLandBelop),
    {
      error: "skatteforholdOgInntektSteg.ugyldigBelopFormat",
      path: ["pengestotteSomMottasFraAndreLandBelop"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.arbeidsinntektFraNorskEllerUtenlandskVirksomhet) return true;
      return Object.values(
        data.arbeidsinntektFraNorskEllerUtenlandskVirksomhet,
      ).some(Boolean);
    },
    {
      error: "skatteforholdOgInntektSteg.duMaVelgeMinsteEnArbeidsinntektKilde",
      path: ["arbeidsinntektFraNorskEllerUtenlandskVirksomhet"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu) return true;
      return Object.values(data.hvilkeTyperInntektHarDu).some(Boolean);
    },
    {
      error: "skatteforholdOgInntektSteg.duMaVelgeMinsteEnInntektType",
      path: ["hvilkeTyperInntektHarDu"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.LOENN) return true;
      const harNorskVirksomhet =
        data.arbeidsinntektFraNorskEllerUtenlandskVirksomhet
          ?.NORSK_VIRKSOMHET === true;
      const harUtenlandskVirksomhet =
        data.arbeidsinntektFraNorskEllerUtenlandskVirksomhet
          ?.UTENLANDSK_VIRKSOMHET === true;
      if (
        data.erSkattepliktigTilNorgeIHeleutsendingsperioden &&
        harNorskVirksomhet &&
        !harUtenlandskVirksomhet
      ) {
        return true;
      }
      return !!data.inntekterFraUtenlandskVirksomhet?.trim();
    },
    {
      error:
        "skatteforholdOgInntektSteg.duMaOppgiInntekterFraUtenlandskVirksomhet",
      path: ["inntekterFraUtenlandskVirksomhet"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.LOENN) return true;
      if (!data.inntekterFraUtenlandskVirksomhet?.trim()) return true;
      return erGyldigBelop(data.inntekterFraUtenlandskVirksomhet);
    },
    {
      error: "skatteforholdOgInntektSteg.ugyldigBelopFormat",
      path: ["inntekterFraUtenlandskVirksomhet"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.INNTEKT_FRA_EGEN_VIRKSOMHET)
        return true;
      return !!data.inntekterFraEgenVirksomhet?.trim();
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiInntekterFraEgenVirksomhet",
      path: ["inntekterFraEgenVirksomhet"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.INNTEKT_FRA_EGEN_VIRKSOMHET)
        return true;
      if (!data.inntekterFraEgenVirksomhet?.trim()) return true;
      return erGyldigBelop(data.inntekterFraEgenVirksomhet);
    },
    {
      error: "skatteforholdOgInntektSteg.ugyldigBelopFormat",
      path: ["inntekterFraEgenVirksomhet"],
      when: () => true,
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
    // Trim beløp and strip thousand separators
    pengestotteSomMottasFraAndreLandBelop:
      data.mottarPengestotteFraAnnetEosLandEllerSveits &&
      data.pengestotteSomMottasFraAndreLandBelop
        ? data.pengestotteSomMottasFraAndreLandBelop
            .trim()
            .replaceAll(/\s/g, "")
        : undefined,
    arbeidsinntektFraNorskEllerUtenlandskVirksomhet:
      data.arbeidsinntektFraNorskEllerUtenlandskVirksomhet,
    hvilkeTyperInntektHarDu: data.hvilkeTyperInntektHarDu,
    // Clear income fields based on hvilkeTyperInntektHarDu selections and valid combinations
    inntekterFraUtenlandskVirksomhet: (() => {
      if (!data.hvilkeTyperInntektHarDu?.LOENN) return;
      const harNorsk =
        data.arbeidsinntektFraNorskEllerUtenlandskVirksomhet
          ?.NORSK_VIRKSOMHET === true;
      const harUtenlandsk =
        data.arbeidsinntektFraNorskEllerUtenlandskVirksomhet
          ?.UTENLANDSK_VIRKSOMHET === true;
      if (
        data.erSkattepliktigTilNorgeIHeleutsendingsperioden &&
        harNorsk &&
        !harUtenlandsk
      ) {
        return;
      }
      return data.inntekterFraUtenlandskVirksomhet
        ?.trim()
        .replaceAll(/\s/g, "");
    })(),
    inntekterFraEgenVirksomhet: data.hvilkeTyperInntektHarDu
      ?.INNTEKT_FRA_EGEN_VIRKSOMHET
      ? data.inntekterFraEgenVirksomhet?.trim().replaceAll(/\s/g, "")
      : undefined,
  }));
