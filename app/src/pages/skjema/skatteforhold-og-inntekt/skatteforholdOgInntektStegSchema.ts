import { z } from "zod";

import { normaliserBelopForApi } from "~/utils/belopFormat.ts";

function erPositivtBelop(belop?: string): boolean {
  if (!belop) return false;
  const normalized = normaliserBelopForApi(belop);
  return !!/^[1-9]\d*$/.test(normalized);
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
  return !(erSkattepliktig && harNorskVirksomhet) || harUtenlandskVirksomhet;
}

type SchemaData = z.input<typeof baseSchema>;

function harNorsk(data: SchemaData): boolean {
  return (
    data.inntektFraNorskEllerUtenlandskVirksomhet?.includes(
      "NORSK_VIRKSOMHET",
    ) ?? false
  );
}

function harUtenlandsk(data: SchemaData): boolean {
  return (
    data.inntektFraNorskEllerUtenlandskVirksomhet?.includes(
      "UTENLANDSK_VIRKSOMHET",
    ) ?? false
  );
}

function skalValidereLoennsinntekt(data: SchemaData): boolean {
  return !data.hvilkeTyperInntektHarDu?.includes("LOENN") ||
    (!harNorsk(data) && !harUtenlandsk(data))
    ? false
    : skalInkludereLoennsinntekt(
        data.erSkattepliktigTilNorgeIHeleutsendingsperioden,
        harNorsk(data),
        harUtenlandsk(data),
      );
}

function skalValidereEgenVirksomhetInntekt(data: SchemaData): boolean {
  return data.hvilkeTyperInntektHarDu?.includes("INNTEKT_FRA_EGEN_VIRKSOMHET")
    ? harNorsk(data) || harUtenlandsk(data)
    : false;
}

const checkboxGroupSchema = z.array(z.string()).optional();

const baseSchema = z.object({
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
});

export const skatteforholdOgInntektSchema = baseSchema
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
      if (!skalValidereLoennsinntekt(data)) return true;
      return data.inntekt?.trim() ? erPositivtBelop(data.inntekt) : false;
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiLonnsinntekt",
      path: ["inntekt"],
    },
  )
  .refine(
    (data) => {
      if (!skalValidereEgenVirksomhetInntekt(data)) return true;
      return data.inntektFraEgenVirksomhet?.trim()
        ? erPositivtBelop(data.inntektFraEgenVirksomhet)
        : false;
    },
    {
      error: "skatteforholdOgInntektSteg.duMaOppgiInntektFraEgenVirksomhet",
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
        ? normaliserBelopForApi(data.pengestotteSomMottasFraAndreLandBelop)
        : undefined,
    inntektFraNorskEllerUtenlandskVirksomhet:
      data.inntektFraNorskEllerUtenlandskVirksomhet,
    hvilkeTyperInntektHarDu: data.hvilkeTyperInntektHarDu,
    inntekt:
      skalValidereLoennsinntekt(data) && data.inntekt
        ? normaliserBelopForApi(data.inntekt)
        : undefined,
    inntektFraEgenVirksomhet:
      skalValidereEgenVirksomhetInntekt(data) && data.inntektFraEgenVirksomhet
        ? normaliserBelopForApi(data.inntektFraEgenVirksomhet)
        : undefined,
  }));
