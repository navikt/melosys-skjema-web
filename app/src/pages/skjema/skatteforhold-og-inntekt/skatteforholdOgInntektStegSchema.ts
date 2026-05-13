import { z } from "zod";

import { stripBelopFormatering } from "~/utils/belopFormat.ts";

function erPositivtBelop(belop?: string): boolean {
  if (!belop) return false;
  const stripped = stripBelopFormatering(belop.trim()).replace(/[.,]\d*$/, "");
  if (!/^\d+$/.test(stripped)) return false;
  return Number.parseInt(stripped, 10) > 0;
}

/**
 * Avgjør om lønnsinntektsfelt skal inkluderes (vises og valideres).
 * Regelen: feltet inkluderes med mindre bruker er skattepliktig til Norge
 * og har KUN norsk virksomhet (ikke utenlandsk).
 */
export function skalInkludereLoennsinntekt(
  erSkattepliktig: boolean | undefined,
  harNorskVirksomhet: boolean,
  harUtenlandskVirksomhet: boolean,
): boolean {
  return !(erSkattepliktig && harNorskVirksomhet && !harUtenlandskVirksomhet);
}

const checkboxGroupSchema = z.array(z.string()).optional();

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
    },
  )
  .refine(
    (data) =>
      !data.mottarPengestotteFraAnnetEosLandEllerSveits ||
      erPositivtBelop(data.pengestotteSomMottasFraAndreLandBelop),
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
      path: ["pengestotteSomMottasFraAndreLandBelop"],
    },
  )
  .refine(
    (data) => {
      return (
        !!data.inntektFraNorskEllerUtenlandskVirksomhet &&
        data.inntektFraNorskEllerUtenlandskVirksomhet.length > 0
      );
    },
    {
      error: "skatteforholdOgInntektSteg.duMaVelgeMinstEnInntektKilde",
      path: ["inntektFraNorskEllerUtenlandskVirksomhet"],
    },
  )
  .refine(
    (data) => {
      return (
        !!data.hvilkeTyperInntektHarDu &&
        data.hvilkeTyperInntektHarDu.length > 0
      );
    },
    {
      error: "skatteforholdOgInntektSteg.duMaVelgeMinstEnInntektType",
      path: ["hvilkeTyperInntektHarDu"],
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.includes("LOENN")) return true;
      const harNorsk =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.includes(
          "NORSK_VIRKSOMHET",
        ) ?? false;
      const harUtenlandsk =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.includes(
          "UTENLANDSK_VIRKSOMHET",
        ) ?? false;
      if (!harNorsk && !harUtenlandsk) return true;
      if (
        !skalInkludereLoennsinntekt(
          data.erSkattepliktigTilNorgeIHeleutsendingsperioden,
          harNorsk,
          harUtenlandsk,
        )
      ) {
        return true;
      }
      return !!data.inntekt?.trim();
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiLonnsinntekt",
      path: ["inntekt"],
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu?.includes("LOENN")) return true;
      if (!data.inntekt?.trim()) return true;
      return erPositivtBelop(data.inntekt);
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
      path: ["inntekt"],
    },
  )
  .refine(
    (data) => {
      if (
        !data.hvilkeTyperInntektHarDu?.includes("INNTEKT_FRA_EGEN_VIRKSOMHET")
      )
        return true;
      const harNoenVirksomhet =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.some((v) =>
          ["NORSK_VIRKSOMHET", "UTENLANDSK_VIRKSOMHET"].includes(v),
        ) ?? false;
      if (!harNoenVirksomhet) return true;
      return !!data.inntektFraEgenVirksomhet?.trim();
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiInntektFraEgenVirksomhet",
      path: ["inntektFraEgenVirksomhet"],
    },
  )
  .refine(
    (data) => {
      if (
        !data.hvilkeTyperInntektHarDu?.includes("INNTEKT_FRA_EGEN_VIRKSOMHET")
      )
        return true;
      if (!data.inntektFraEgenVirksomhet?.trim()) return true;
      return erPositivtBelop(data.inntektFraEgenVirksomhet);
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
      path: ["inntektFraEgenVirksomhet"],
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
      if (!data.hvilkeTyperInntektHarDu?.includes("LOENN")) return;
      const harNorsk =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.includes(
          "NORSK_VIRKSOMHET",
        ) ?? false;
      const harUtenlandsk =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.includes(
          "UTENLANDSK_VIRKSOMHET",
        ) ?? false;
      if (!harNorsk && !harUtenlandsk) return;
      if (
        !skalInkludereLoennsinntekt(
          data.erSkattepliktigTilNorgeIHeleutsendingsperioden,
          harNorsk,
          harUtenlandsk,
        )
      ) {
        return;
      }
      return data.inntekt
        ? stripBelopFormatering(data.inntekt.trim())
        : undefined;
    })(),
    inntektFraEgenVirksomhet: (() => {
      if (
        !data.hvilkeTyperInntektHarDu?.includes("INNTEKT_FRA_EGEN_VIRKSOMHET")
      )
        return;
      const harNoenVirksomhet =
        data.inntektFraNorskEllerUtenlandskVirksomhet?.some((v) =>
          ["NORSK_VIRKSOMHET", "UTENLANDSK_VIRKSOMHET"].includes(v),
        ) ?? false;
      if (!harNoenVirksomhet) return;
      return data.inntektFraEgenVirksomhet
        ? stripBelopFormatering(data.inntektFraEgenVirksomhet.trim())
        : undefined;
    })(),
  }));
