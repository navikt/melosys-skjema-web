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
  organisasjonsnummer: z.string().optional(),
  vegnavnOgHusnummer: z
    .string({
      message: "generellValidering.vegnavnOgHusnummerErPakrevd",
    })
    .min(1, {
      message: "generellValidering.vegnavnOgHusnummerErPakrevd",
    }),
  bygning: z.string().optional(),
  postkode: z.string().optional(),
  byStedsnavn: z.string().optional(),
  region: z.string().optional(),
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
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z
    .boolean()
    .optional(),
  virksomheterSomUtbetalerLonnOgNaturalytelser: z
    .object({
      norskeVirksomheter: z.array(norskVirksomhetSchema).optional(),
      utenlandskeVirksomheter: z.array(utenlandskVirksomhetSchema).optional(),
    })
    .optional(),
});

type BaseArbeidstakerensLonnFormData = z.infer<
  typeof baseArbeidstakerensLonnSchema
>;

function validerArbeidsgiverBetalerAllLonnPakrevd(
  data: BaseArbeidstakerensLonnFormData,
) {
  return (
    data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden !==
    undefined
  );
}

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

export const arbeidstakerensLonnSchema = baseArbeidstakerensLonnSchema
  .transform((data) => ({
    ...data,
    // Clear conditional field when arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden is true
    virksomheterSomUtbetalerLonnOgNaturalytelser:
      data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden
        ? undefined
        : data.virksomheterSomUtbetalerLonnOgNaturalytelser,
  }))
  .refine(validerArbeidsgiverBetalerAllLonnPakrevd, {
    message:
      "arbeidstakerenslonnSteg.duMaSvarePaOmDuBetalerAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden",
    path: ["arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden"],
  })
  .refine(validerVirksomheterPakrevd, {
    message:
      "arbeidstakerenslonnSteg.duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv",
    path: ["virksomheterSomUtbetalerLonnOgNaturalytelser"],
  });
