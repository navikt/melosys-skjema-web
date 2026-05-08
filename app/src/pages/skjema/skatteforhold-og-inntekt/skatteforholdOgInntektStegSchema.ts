import { z } from "zod";

import { stripBelopFormatering } from "~/utils/belopFormat.ts";

function erPositivtBelop(belop?: string): boolean {
  if (!belop) return false;
  const stripped = stripBelopFormatering(belop.trim());
  const parsed = Number.parseInt(stripped, 10);
  return !Number.isNaN(parsed) && parsed > 0;
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
    inntektFraNorskEllerUtenlandskVirksomhet: checkboxGroupSchema,
    hvilkeTyperInntektHarDu: checkboxGroupSchema,
    inntekt: z.string().optional(),
    inntektFraEgenVirksomhet: z.string().optional(),
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
      erPositivtBelop(data.pengestotteSomMottasFraAndreLandBelop),
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
      path: ["pengestotteSomMottasFraAndreLandBelop"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.inntektFraNorskEllerUtenlandskVirksomhet) return true;
      return Object.values(data.inntektFraNorskEllerUtenlandskVirksomhet).some(
        Boolean,
      );
    },
    {
      error: "skatteforholdOgInntektSteg.duMaVelgeMinstEnInntektKilde",
      path: ["inntektFraNorskEllerUtenlandskVirksomhet"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu) return true;
      return Object.values(data.hvilkeTyperInntektHarDu).some(Boolean);
    },
    {
      error: "skatteforholdOgInntektSteg.duMaVelgeMinstEnInntektType",
      path: ["hvilkeTyperInntektHarDu"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.LOENN) return true;
      const harNorskVirksomhet =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.NORSK_VIRKSOMHET ===
        true;
      const harUtenlandskVirksomhet =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.UTENLANDSK_VIRKSOMHET ===
        true;
      if (
        data.erSkattepliktigTilNorgeIHeleutsendingsperioden &&
        harNorskVirksomhet &&
        !harUtenlandskVirksomhet
      ) {
        return true;
      }
      return !!data.inntekt?.trim();
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiLonnsinntekt",
      path: ["inntekt"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.LOENN) return true;
      if (!data.inntekt?.trim()) return true;
      return erPositivtBelop(data.inntekt);
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
      path: ["inntekt"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.INNTEKT_FRA_EGEN_VIRKSOMHET)
        return true;
      return !!data.inntektFraEgenVirksomhet?.trim();
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiInntektFraEgenVirksomhet",
      path: ["inntektFraEgenVirksomhet"],
      when: () => true,
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.INNTEKT_FRA_EGEN_VIRKSOMHET)
        return true;
      if (!data.inntektFraEgenVirksomhet?.trim()) return true;
      return erPositivtBelop(data.inntektFraEgenVirksomhet);
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
      path: ["inntektFraEgenVirksomhet"],
      when: () => true,
    },
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
    landSomUtbetalerPengestotte:
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? data.landSomUtbetalerPengestotte
        : undefined,
    pengestotteSomMottasFraAndreLandBelop:
      data.mottarPengestotteFraAnnetEosLandEllerSveits &&
      data.pengestotteSomMottasFraAndreLandBelop
        ? stripBelopFormatering(
            data.pengestotteSomMottasFraAndreLandBelop.trim(),
          )
        : undefined,
    inntektFraNorskEllerUtenlandskVirksomhet:
      data.inntektFraNorskEllerUtenlandskVirksomhet,
    hvilkeTyperInntektHarDu: data.hvilkeTyperInntektHarDu,
    inntekt: (() => {
      if (!data.hvilkeTyperInntektHarDu?.LOENN) return;
      const harNorsk =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.NORSK_VIRKSOMHET ===
        true;
      const harUtenlandsk =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.UTENLANDSK_VIRKSOMHET ===
        true;
      if (
        data.erSkattepliktigTilNorgeIHeleutsendingsperioden &&
        harNorsk &&
        !harUtenlandsk
      ) {
        return;
      }
      return data.inntekt
        ? stripBelopFormatering(data.inntekt.trim())
        : undefined;
    })(),
    inntektFraEgenVirksomhet: data.hvilkeTyperInntektHarDu
      ?.INNTEKT_FRA_EGEN_VIRKSOMHET
      ? data.inntektFraEgenVirksomhet
        ? stripBelopFormatering(data.inntektFraEgenVirksomhet.trim())
        : undefined
      : undefined,
  }));
