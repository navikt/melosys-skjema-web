import { z } from "zod";

import { stripBelopFormatering } from "~/utils/belopFormat.ts";

function erPositivtBelop(belop?: string): boolean {
  if (!belop) return false;
  const stripped = stripBelopFormatering(belop.trim());
  const parsed = Number.parseInt(stripped, 10);
  return !Number.isNaN(parsed) && parsed > 0;
}

/**
 * Avgjør om lønnsinntektsfelt kreves/vises.
 * Regelen: feltet er påkrevd med mindre bruker er skattepliktig til Norge
 * og har KUN norsk virksomhet (ikke utenlandsk).
 */
export function kreverLoennsinntektFelt(
  erSkattepliktig: boolean | undefined,
  harNorskVirksomhet: boolean,
  harUtenlandskVirksomhet: boolean,
): boolean {
  if (erSkattepliktig && harNorskVirksomhet && !harUtenlandskVirksomhet) {
    return false;
  }
  return true;
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
      if (!data.inntektFraNorskEllerUtenlandskVirksomhet) return true;
      return data.inntektFraNorskEllerUtenlandskVirksomhet.length > 0;
    },
    {
      error: "skatteforholdOgInntektSteg.duMaVelgeMinstEnInntektKilde",
      path: ["inntektFraNorskEllerUtenlandskVirksomhet"],
    },
  )
  .refine(
    (data) => {
      if (!data.hvilkeTyperInntektHarDu) return true;
      return data.hvilkeTyperInntektHarDu.length > 0;
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
      if (
        !kreverLoennsinntektFelt(
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
      if (
        !kreverLoennsinntektFelt(
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
    inntektFraEgenVirksomhet: data.hvilkeTyperInntektHarDu?.includes(
      "INNTEKT_FRA_EGEN_VIRKSOMHET",
    )
      ? data.inntektFraEgenVirksomhet
        ? stripBelopFormatering(data.inntektFraEgenVirksomhet.trim())
        : undefined
      : undefined,
  }));
