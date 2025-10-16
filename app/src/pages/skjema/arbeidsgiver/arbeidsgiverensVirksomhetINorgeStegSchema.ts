import { z } from "zod";

const baseArbeidsgiverensVirksomhetSchema = z.object({
  erArbeidsgiverenOffentligVirksomhet: z
    .boolean({
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEnOffentligVirksomhet",
    })
    .nullish(),
  erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean().nullish(),
  opprettholderArbeidsgiverenVanligDrift: z.boolean().nullish(),
});

type BaseArbeidsgiverensVirksomhetFormData = z.infer<
  typeof baseArbeidsgiverensVirksomhetSchema
>;

function validerBemanningsEllerVikarbyraaPakrevd(
  data: BaseArbeidsgiverensVirksomhetFormData,
) {
  if (data.erArbeidsgiverenOffentligVirksomhet === false) {
    return (
      data.erArbeidsgiverenBemanningsEllerVikarbyraa !== undefined &&
      data.erArbeidsgiverenBemanningsEllerVikarbyraa !== null
    );
  }
  return true;
}

function validerVanligDriftPakrevd(
  data: BaseArbeidsgiverensVirksomhetFormData,
) {
  if (data.erArbeidsgiverenOffentligVirksomhet === false) {
    return (
      data.opprettholderArbeidsgiverenVanligDrift !== undefined &&
      data.opprettholderArbeidsgiverenVanligDrift !== null
    );
  }
  return true;
}

export const arbeidsgiverensVirksomhetSchema =
  baseArbeidsgiverensVirksomhetSchema
    .transform((data) => ({
      ...data,
      // Clear conditional fields when erArbeidsgiverenOffentligVirksomhet is true
      erArbeidsgiverenBemanningsEllerVikarbyraa:
        data.erArbeidsgiverenOffentligVirksomhet === true
          ? undefined
          : data.erArbeidsgiverenBemanningsEllerVikarbyraa,
      opprettholderArbeidsgiverenVanligDrift:
        data.erArbeidsgiverenOffentligVirksomhet === true
          ? undefined
          : data.opprettholderArbeidsgiverenVanligDrift,
    }))
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
