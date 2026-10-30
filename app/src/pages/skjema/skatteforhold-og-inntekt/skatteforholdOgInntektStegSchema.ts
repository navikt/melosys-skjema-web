import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";
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
  return (
    !!data.hvilkeTyperInntektHarDu?.includes("LOENN") &&
    (harNorsk(data) || harUtenlandsk(data)) &&
    skalInkludereLoennsinntekt(
      data.erSkattepliktigTilNorgeIHeleutsendingsperioden,
      harNorsk(data),
      harUtenlandsk(data),
    )
  );
}

function skalValidereEgenVirksomhetInntekt(data: SchemaData): boolean {
  return (
    !!data.hvilkeTyperInntektHarDu?.includes("INNTEKT_FRA_EGEN_VIRKSOMHET") &&
    (harNorsk(data) || harUtenlandsk(data))
  );
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
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z
    .boolean()
    .optional(),
  virksomheterSomUtbetalerLonnOgNaturalytelser:
    norskeOgUtenlandskeVirksomheterSchema.optional(),
});

function harVirksomhetSomUtbetalerLonn(data: SchemaData): boolean {
  const v = data.virksomheterSomUtbetalerLonnOgNaturalytelser;
  return (
    (v?.norskeVirksomheter?.length ?? 0) > 0 ||
    (v?.utenlandskeVirksomheter?.length ?? 0) > 0
  );
}

/**
 * I statsansattflyten utelates inntektskilder, inntektstype og inntektsbeløp, men ikke pengestøtte.
 * Statsansatte som sender før arbeidsgiver, besvarer også lønnsspørsmålene her når medLonn er satt.
 */
export const lagSkatteforholdOgInntektSchema = ({
  statsansattFlyt,
  medLonn,
}: {
  statsansattFlyt: boolean;
  medLonn: boolean;
}) =>
  baseSchema
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
        error:
          "skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0",
        path: ["pengestotteSomMottasFraAndreLandBelop"],
        when: () => true,
      },
    )
    .refine(
      (data) => {
        return (
          statsansattFlyt ||
          (!!data.inntektFraNorskEllerUtenlandskVirksomhet &&
            data.inntektFraNorskEllerUtenlandskVirksomhet.length > 0)
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
        return (
          statsansattFlyt ||
          (!!data.hvilkeTyperInntektHarDu &&
            data.hvilkeTyperInntektHarDu.length > 0)
        );
      },
      {
        error: "skatteforholdOgInntektSteg.duMaVelgeMinstEnInntektType",
        path: ["hvilkeTyperInntektHarDu"],
        when: () => true,
      },
    )
    .refine(
      (data) => {
        return (
          statsansattFlyt ||
          !skalValidereLoennsinntekt(data) ||
          (!!data.inntekt?.trim() && erPositivtBelop(data.inntekt))
        );
      },
      {
        error: "skatteforholdOgInntektSteg.duMaOppgiLonnsinntekt",
        path: ["inntekt"],
        when: () => true,
      },
    )
    .refine(
      (data) => {
        return (
          statsansattFlyt ||
          !skalValidereEgenVirksomhetInntekt(data) ||
          (!!data.inntektFraEgenVirksomhet?.trim() &&
            erPositivtBelop(data.inntektFraEgenVirksomhet))
        );
      },
      {
        error: "skatteforholdOgInntektSteg.duMaOppgiInntektFraEgenVirksomhet",
        path: ["inntektFraEgenVirksomhet"],
        when: () => true,
      },
    )
    .refine(
      (data) =>
        !medLonn ||
        data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden !==
          undefined,
      {
        error:
          "skatteforholdOgInntektSteg.duMaSvarePaOmArbeidsgiverBetalerAllLonn",
        path: ["arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden"],
        when: () => true,
      },
    )
    .refine(
      (data) =>
        !medLonn ||
        data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden !==
          false ||
        harVirksomhetSomUtbetalerLonn(data),
      {
        error:
          "skatteforholdOgInntektSteg.duMaLeggeTilMinstEnVirksomhetSomUtbetalerLonn",
        path: ["virksomheterSomUtbetalerLonnOgNaturalytelser"],
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
          ? normaliserBelopForApi(data.pengestotteSomMottasFraAndreLandBelop)
          : undefined,
      inntektFraNorskEllerUtenlandskVirksomhet: statsansattFlyt
        ? undefined
        : data.inntektFraNorskEllerUtenlandskVirksomhet,
      hvilkeTyperInntektHarDu: statsansattFlyt
        ? undefined
        : data.hvilkeTyperInntektHarDu,
      inntekt:
        !statsansattFlyt && skalValidereLoennsinntekt(data) && data.inntekt
          ? normaliserBelopForApi(data.inntekt)
          : undefined,
      inntektFraEgenVirksomhet:
        !statsansattFlyt &&
        skalValidereEgenVirksomhetInntekt(data) &&
        data.inntektFraEgenVirksomhet
          ? normaliserBelopForApi(data.inntektFraEgenVirksomhet)
          : undefined,
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: medLonn
        ? data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden
        : undefined,
      virksomheterSomUtbetalerLonnOgNaturalytelser:
        medLonn &&
        data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden ===
          false
          ? data.virksomheterSomUtbetalerLonnOgNaturalytelser
          : undefined,
    }));

export const skatteforholdOgInntektSchema = lagSkatteforholdOgInntektSchema({
  statsansattFlyt: false,
  medLonn: false,
});
