import { z } from "zod";

const baseArbeidsgiverenSchema = z.object({
  organisasjonsnummer: z.string(),
});

type BaseArbeidsgiverenFormData = z.infer<typeof baseArbeidsgiverenSchema>;

function validerOrganisasjonsnummerPakrevd(data: BaseArbeidsgiverenFormData) {
  return data.organisasjonsnummer && data.organisasjonsnummer.length > 0;
}

function validerOrganisasjonsnummerFormat(data: BaseArbeidsgiverenFormData) {
  if (data.organisasjonsnummer && data.organisasjonsnummer.length > 0) {
    return /^\d{9}$/.test(data.organisasjonsnummer);
  }
  return true;
}

export const arbeidsgiverenSchema = baseArbeidsgiverenSchema
  .refine(validerOrganisasjonsnummerPakrevd, {
    message: "generellValidering.organisasjonsnummerErPakrevd",
    path: ["organisasjonsnummer"],
  })
  .refine(validerOrganisasjonsnummerFormat, {
    message: "generellValidering.organisasjonsnummerMaVare9Siffer",
    path: ["organisasjonsnummer"],
  });
