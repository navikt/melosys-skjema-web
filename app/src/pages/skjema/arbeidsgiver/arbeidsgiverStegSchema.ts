import { z } from "zod";

const baseArbeidsgiverSchema = z.object({
  organisasjonsnummer: z.string(),
});

type BaseArbeidsgiverFormData = z.infer<typeof baseArbeidsgiverSchema>;

function validerOrganisasjonsnummerPakrevd(data: BaseArbeidsgiverFormData) {
  return data.organisasjonsnummer && data.organisasjonsnummer.length > 0;
}

function validerOrganisasjonsnummerFormat(data: BaseArbeidsgiverFormData) {
  if (data.organisasjonsnummer && data.organisasjonsnummer.length > 0) {
    return /^\d{9}$/.test(data.organisasjonsnummer);
  }
  return true;
}

export const arbeidsgiverSchema = baseArbeidsgiverSchema
  .refine(validerOrganisasjonsnummerPakrevd, {
    message: "generellValidering.organisasjonsnummerErPakrevd",
    path: ["organisasjonsnummer"],
  })
  .refine(validerOrganisasjonsnummerFormat, {
    message: "generellValidering.organisasjonsnummerMaVare9Siffer",
    path: ["organisasjonsnummer"],
  });
