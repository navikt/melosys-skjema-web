import { z } from "zod";

import { Ansettelsesform } from "~/types/melosysSkjemaTypes";
import { organisasjonsnummerHarGyldigFormat } from "~/utils/valideringUtils.ts";

/**
 * Påkrevd tekstfelt som er valgfritt i API-typen. Feltet er optional i
 * input-typen, men manglende verdi gjøres om til tom streng og valideres, slik
 * at feltet feiler både når det er blankt og når det mangler i objektet.
 */
const paakrevdTekstfelt = (feilmelding: string) =>
  z
    .string()
    .optional()
    .transform((verdi) => verdi ?? "")
    .pipe(z.string().trim().min(1, { message: feilmelding }));

export const norskVirksomhetSchema = z.object({
  organisasjonsnummer: z
    .string({
      message: "generellValidering.organisasjonsnummerErPakrevd",
    })
    .min(1, {
      message: "generellValidering.organisasjonsnummerErPakrevd",
    })
    .refine(organisasjonsnummerHarGyldigFormat, {
      message: "generellValidering.organisasjonsnummerHarUgyldigFormat",
    }),
});

export const utenlandskVirksomhetSchema = z.object({
  navn: z
    .string({
      message: "generellValidering.navnPaVirksomhetErPakrevd",
    })
    .trim()
    .min(1, {
      message: "generellValidering.navnPaVirksomhetErPakrevd",
    }),
  organisasjonsnummer: z
    .string()
    .trim()
    .max(25, {
      message:
        "generellValidering.organisasjonsnummerEllerRegistreringsnummerKanIkkeVaereLengreEnn25Tegn",
    })
    .optional(),
  vegnavnOgHusnummer: z
    .string({
      message: "generellValidering.vegnavnOgHusnummerErPakrevd",
    })
    .trim()
    .min(1, {
      message: "generellValidering.vegnavnOgHusnummerErPakrevd",
    }),
  bygning: z.string().optional(),
  postkode: paakrevdTekstfelt("generellValidering.postkodeErPakrevd"),
  byStedsnavn: paakrevdTekstfelt("generellValidering.byStedsnavnErPakrevd"),
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
    ansettelsesform: z.enum(Ansettelsesform, {
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
