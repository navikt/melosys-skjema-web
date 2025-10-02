import { z } from "zod";

const baseArbeidstakerensLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.boolean({
    message:
      "arbeidstakerenslonnSteg.duMaSvarePaOmDuBetalerAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden",
  }),
  virksomheterSomUtbetalerLonnOgNaturalytelser: z
    .object({
      norskeVirksomheter: z
        .array(
          z.object({
            organisasjonsnummer: z.string(),
          }),
        )
        .optional(),
      utenlandskeVirksomheter: z
        .array(
          z.object({
            navn: z.string(),
            organisasjonsnummer: z.string().optional(),
            vegnavnOgHusnummer: z.string(),
            bygning: z.string().optional(),
            postkode: z.string().optional(),
            byStedsnavn: z.string().optional(),
            region: z.string().optional(),
            land: z.string(),
            tilhorerSammeKonsern: z.boolean({
              message:
                "generellValidering.duMaSvarePaOmVirksomhetenTilhorerSammeKonsern",
            }),
          }),
        )
        .optional(),
    })
    .optional(),
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

function validerNorskeOrganisasjonsnummerePakrevd(
  data: BaseArbeidstakerensLonnFormData,
) {
  const norskeVirksomheter =
    data.virksomheterSomUtbetalerLonnOgNaturalytelser?.norskeVirksomheter;
  if (norskeVirksomheter && norskeVirksomheter.length > 0) {
    return norskeVirksomheter.every(
      (v) => v.organisasjonsnummer && v.organisasjonsnummer.length > 0,
    );
  }
  return true;
}

function validerNorskeOrganisasjonsnummereFormat(
  data: BaseArbeidstakerensLonnFormData,
) {
  const norskeVirksomheter =
    data.virksomheterSomUtbetalerLonnOgNaturalytelser?.norskeVirksomheter;
  if (norskeVirksomheter && norskeVirksomheter.length > 0) {
    return norskeVirksomheter.every(
      (v) => !v.organisasjonsnummer || /^\d{9}$/.test(v.organisasjonsnummer),
    );
  }
  return true;
}

function validerUtenlandskeVirksomheterNavn(
  data: BaseArbeidstakerensLonnFormData,
) {
  const utenlandskeVirksomheter =
    data.virksomheterSomUtbetalerLonnOgNaturalytelser?.utenlandskeVirksomheter;
  if (utenlandskeVirksomheter && utenlandskeVirksomheter.length > 0) {
    return utenlandskeVirksomheter.every((v) => v.navn && v.navn.length > 0);
  }
  return true;
}

function validerUtenlandskeVirksomheterAdresse(
  data: BaseArbeidstakerensLonnFormData,
) {
  const utenlandskeVirksomheter =
    data.virksomheterSomUtbetalerLonnOgNaturalytelser?.utenlandskeVirksomheter;
  if (utenlandskeVirksomheter && utenlandskeVirksomheter.length > 0) {
    return utenlandskeVirksomheter.every(
      (v) => v.vegnavnOgHusnummer && v.vegnavnOgHusnummer.length > 0,
    );
  }
  return true;
}

function validerUtenlandskeVirksomheterLand(
  data: BaseArbeidstakerensLonnFormData,
) {
  const utenlandskeVirksomheter =
    data.virksomheterSomUtbetalerLonnOgNaturalytelser?.utenlandskeVirksomheter;
  if (utenlandskeVirksomheter && utenlandskeVirksomheter.length > 0) {
    return utenlandskeVirksomheter.every((v) => v.land && v.land.length > 0);
  }
  return true;
}

export const arbeidstakerensLonnSchema = baseArbeidstakerensLonnSchema
  .refine(validerVirksomheterPakrevd, {
    message:
      "arbeidstakerenslonnSteg.duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv",
    path: ["virksomheterSomUtbetalerLonnOgNaturalytelser"],
  })
  .refine(validerNorskeOrganisasjonsnummerePakrevd, {
    message: "generellValidering.organisasjonsnummerErPakrevd",
    path: [
      "virksomheterSomUtbetalerLonnOgNaturalytelser",
      "norskeVirksomheter",
    ],
  })
  .refine(validerNorskeOrganisasjonsnummereFormat, {
    message: "generellValidering.organisasjonsnummerMaVare9Siffer",
    path: [
      "virksomheterSomUtbetalerLonnOgNaturalytelser",
      "norskeVirksomheter",
    ],
  })
  .refine(validerUtenlandskeVirksomheterNavn, {
    message: "generellValidering.navnPaVirksomhetErPakrevd",
    path: [
      "virksomheterSomUtbetalerLonnOgNaturalytelser",
      "utenlandskeVirksomheter",
    ],
  })
  .refine(validerUtenlandskeVirksomheterAdresse, {
    message: "generellValidering.vegnavnOgHusnummerErPakrevd",
    path: [
      "virksomheterSomUtbetalerLonnOgNaturalytelser",
      "utenlandskeVirksomheter",
    ],
  })
  .refine(validerUtenlandskeVirksomheterLand, {
    message: "generellValidering.landErPakrevd",
    path: [
      "virksomheterSomUtbetalerLonnOgNaturalytelser",
      "utenlandskeVirksomheter",
    ],
  });
