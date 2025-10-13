import { z } from "zod";

const norskVirksomhetSchema = z.object({
  organisasjonsnummer: z
    .string({
      message: "generellValidering.organisasjonsnummerErPakrevd",
    })
    .min(1, {
      message: "generellValidering.organisasjonsnummerErPakrevd",
    })
    .regex(/^\d{9}$/, {
      message: "generellValidering.organisasjonsnummerMaVare9Siffer",
    }),
});

const utenlandskVirksomhetSchema = z.object({
  navn: z
    .string({
      message: "generellValidering.navnPaVirksomhetErPakrevd",
    })
    .min(1, {
      message: "generellValidering.navnPaVirksomhetErPakrevd",
    }),
  organisasjonsnummer: z.string().nullish(),
  vegnavnOgHusnummer: z
    .string({
      message: "generellValidering.vegnavnOgHusnummerErPakrevd",
    })
    .min(1, {
      message: "generellValidering.vegnavnOgHusnummerErPakrevd",
    }),
  bygning: z.string().nullish(),
  postkode: z.string().nullish(),
  byStedsnavn: z.string().nullish(),
  region: z.string().nullish(),
  land: z
    .string({
      message: "generellValidering.landErPakrevd",
    })
    .min(1, {
      message: "generellValidering.landErPakrevd",
    }),
  tilhorerSammeKonsern: z.boolean({
    message: "generellValidering.duMaSvarePaOmVirksomhetenTilhorerSammeKonsern",
  }),
});

const baseArbeidstakerensLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.boolean({
    message:
      "arbeidstakerenslonnSteg.duMaSvarePaOmDuBetalerAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden",
  }),
  virksomheterSomUtbetalerLonnOgNaturalytelser: z
    .object({
      norskeVirksomheter: z.array(norskVirksomhetSchema).nullish(),
      utenlandskeVirksomheter: z.array(utenlandskVirksomhetSchema).nullish(),
    })
    .nullish(),
});

type BaseArbeidstakerensLonnFormData = z.infer<
  typeof baseArbeidstakerensLonnSchema
>;

function validerVirksomheterPakrevd(data: BaseArbeidstakerensLonnFormData) {
  if (!data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden) {
    const harNorskeVirksomheter =
      data.virksomheterSomUtbetalerLonnOgNaturalytelser?.norskeVirksomheter &&
      data.virksomheterSomUtbetalerLonnOgNaturalytelser.norskeVirksomheter
        .length > 0;
    const harUtenlandskeVirksomheter =
      data.virksomheterSomUtbetalerLonnOgNaturalytelser
        ?.utenlandskeVirksomheter &&
      data.virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter
        .length > 0;

    return harNorskeVirksomheter || harUtenlandskeVirksomheter;
  }
  return true;
}

function convertNullToUndefinedForUtenlandskVirksomhet(
  virksomhet: z.infer<typeof utenlandskVirksomhetSchema>,
) {
  return {
    ...virksomhet,
    organisasjonsnummer:
      virksomhet.organisasjonsnummer === null
        ? undefined
        : virksomhet.organisasjonsnummer,
    bygning: virksomhet.bygning === null ? undefined : virksomhet.bygning,
    postkode: virksomhet.postkode === null ? undefined : virksomhet.postkode,
    byStedsnavn:
      virksomhet.byStedsnavn === null ? undefined : virksomhet.byStedsnavn,
    region: virksomhet.region === null ? undefined : virksomhet.region,
  };
}

export const arbeidstakerensLonnSchema = baseArbeidstakerensLonnSchema
  .transform((data) => {
    const result = { ...data };

    // Clear conditional field when arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden is true
    if (data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden) {
      result.virksomheterSomUtbetalerLonnOgNaturalytelser = undefined;
      return result;
    }

    // Convert null to undefined for API compatibility
    if (data.virksomheterSomUtbetalerLonnOgNaturalytelser === null) {
      result.virksomheterSomUtbetalerLonnOgNaturalytelser = undefined;
    } else if (data.virksomheterSomUtbetalerLonnOgNaturalytelser) {
      const virksomheter = {
        ...data.virksomheterSomUtbetalerLonnOgNaturalytelser,
      };

      if (virksomheter.norskeVirksomheter === null) {
        virksomheter.norskeVirksomheter = undefined;
      }

      if (virksomheter.utenlandskeVirksomheter === null) {
        virksomheter.utenlandskeVirksomheter = undefined;
      } else if (virksomheter.utenlandskeVirksomheter) {
        virksomheter.utenlandskeVirksomheter =
          virksomheter.utenlandskeVirksomheter.map((element) =>
            convertNullToUndefinedForUtenlandskVirksomhet(element),
          );
      }

      result.virksomheterSomUtbetalerLonnOgNaturalytelser = virksomheter;
    }

    return result;
  })
  .refine(validerVirksomheterPakrevd, {
    message:
      "arbeidstakerenslonnSteg.duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv",
    path: ["virksomheterSomUtbetalerLonnOgNaturalytelser"],
  });
