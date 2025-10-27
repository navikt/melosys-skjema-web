import { z } from "zod";

const baseArbeidsgiverensVirksomhetSchema = z.object({
  erArbeidsgiverenOffentligVirksomhet: z
    .boolean({
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEnOffentligVirksomhet",
    })
    .optional(),
  erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean().optional(),
  opprettholderArbeidsgiverenVanligDrift: z.boolean().optional(),
});

type BaseArbeidsgiverensVirksomhetFormData = z.infer<
  typeof baseArbeidsgiverensVirksomhetSchema
>;

function validerErArbeidsgiverenOffentligVirksomhetPakrevd(
  data: BaseArbeidsgiverensVirksomhetFormData,
) {
  return data.erArbeidsgiverenOffentligVirksomhet !== undefined;
}

function validerBemanningsEllerVikarbyraaPakrevd(
  data: BaseArbeidsgiverensVirksomhetFormData,
) {
  if (data.erArbeidsgiverenOffentligVirksomhet === false) {
    return data.erArbeidsgiverenBemanningsEllerVikarbyraa !== undefined;
  }
  return true;
}

function validerVanligDriftPakrevd(
  data: BaseArbeidsgiverensVirksomhetFormData,
) {
  if (data.erArbeidsgiverenOffentligVirksomhet === false) {
    return data.opprettholderArbeidsgiverenVanligDrift !== undefined;
  }
  return true;
}

export const arbeidsgiverensVirksomhetSchema =
  baseArbeidsgiverensVirksomhetSchema
    .transform((data) => ({
      ...data,
      // Clear conditional fields when erArbeidsgiverenOffentligVirksomhet is true
      erArbeidsgiverenBemanningsEllerVikarbyraa:
        data.erArbeidsgiverenOffentligVirksomhet
          ? undefined
          : data.erArbeidsgiverenBemanningsEllerVikarbyraa,
      opprettholderArbeidsgiverenVanligDrift:
        data.erArbeidsgiverenOffentligVirksomhet
          ? undefined
          : data.opprettholderArbeidsgiverenVanligDrift,
    }))
    .refine(validerErArbeidsgiverenOffentligVirksomhetPakrevd, {
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEnOffentligVirksomhet",
      path: ["erArbeidsgiverenOffentligVirksomhet"],
    })
    .refine(validerBemanningsEllerVikarbyraaPakrevd, {
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra",
      path: ["erArbeidsgiverenBemanningsEllerVikarbyraa"],
    })
    .refine(validerVanligDriftPakrevd, {
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge",
      path: ["opprettholderArbeidsgiverenVanligDrift"],
    });
