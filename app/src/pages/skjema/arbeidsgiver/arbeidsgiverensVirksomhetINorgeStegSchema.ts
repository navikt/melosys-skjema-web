import { z } from "zod";

const baseArbeidsgiverensVirksomhetSchema = z.object({
  erArbeidsgiverenOffentligVirksomhet: z
    .boolean({
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEnOffentligVirksomhet",
    })
    .nullish(),
  erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean().nullish(),
  opprettholderArbeidsgivereVanligDrift: z.boolean().nullish(),
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
      data.opprettholderArbeidsgivereVanligDrift !== undefined &&
      data.opprettholderArbeidsgivereVanligDrift !== null
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
      opprettholderArbeidsgivereVanligDrift:
        data.erArbeidsgiverenOffentligVirksomhet === true
          ? undefined
          : data.opprettholderArbeidsgivereVanligDrift,
    }))
    .refine(validerBemanningsEllerVikarbyraaPakrevd, {
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra",
      path: ["erArbeidsgiverenBemanningsEllerVikarbyraa"],
    })
    .refine(validerVanligDriftPakrevd, {
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge",
      path: ["opprettholderArbeidsgivereVanligDrift"],
    });
