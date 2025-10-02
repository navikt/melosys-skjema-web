import { z } from "zod";

export const arbeidstakerensLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.boolean({
    message:
      "arbeidstakerenslonnSteg.duMaSvarePaOmDuBetalerAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden",
  }),
  virksomheterSomUtbetalerLonnOgNaturalytelser: z
    .object({
      norskeVirksomheter: z
        .array(
          z.object({
            organisasjonsnummer: z
              .string()
              .min(1, "generellValidering.organisasjonsnummerErPakrevd")
              .regex(
                /^\d{9}$/,
                "generellValidering.organisasjonsnummerMaVare9Siffer",
              ),
          }),
        )
        .optional(),
      utenlandskeVirksomheter: z
        .array(
          z.object({
            navn: z
              .string()
              .min(1, "generellValidering.navnPaVirksomhetErPakrevd"),
            organisasjonsnummer: z.string().optional(),
            vegnavnOgHusnummer: z
              .string()
              .min(1, "generellValidering.vegnavnOgHusnummerErPakrevd"),
            bygning: z.string().optional(),
            postkode: z.string().optional(),
            byStedsnavn: z.string().optional(),
            region: z.string().optional(),
            land: z.string().min(1, "generellValidering.landErPakrevd"),
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
