import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";

const baseArbeidstakerensLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z
    .boolean()
    .optional(),
  virksomheterSomUtbetalerLonnOgNaturalytelser:
    norskeOgUtenlandskeVirksomheterSchema.optional(),
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
