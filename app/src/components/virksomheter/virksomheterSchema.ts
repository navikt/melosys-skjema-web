import { z } from "zod";

import { Ansettelsesform } from "~/types/melosysSkjemaTypes";

export const norskVirksomhetSchema = z.object({
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

export const utenlandskVirksomhetSchema = z.object({
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

export const utenlandskVirksomhetMedAnsettelsesformSchema =
  utenlandskVirksomhetSchema.extend({
    ansettelsesform: z.nativeEnum(Ansettelsesform, {
      message: "generellValidering.ansettelsesformErPakrevd",
    }),
  });

export const norskeOgUtenlandskeVirksomheterSchema = z.object({
  norskeVirksomheter: z.array(norskVirksomhetSchema).optional(),
  utenlandskeVirksomheter: z.array(utenlandskVirksomhetSchema).optional(),
});

export const norskeOgUtenlandskeVirksomheterMedAnsettelsesformSchema = z.object(
  {
    norskeVirksomheter: z.array(norskVirksomhetSchema).optional(),
    utenlandskeVirksomheter: z
      .array(utenlandskVirksomhetMedAnsettelsesformSchema)
      .optional(),
  },
);
