import { z } from "zod";

const baseArbeidsgiverensVirksomhetSchema = z.object({
  erArbeidsgiverenOffentligVirksomhet: z.boolean({
    message:
      "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEnOffentligVirksomhet",
  }),
  erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean().optional(),
  opprettholderArbeidsgivereVanligDrift: z.boolean().optional(),
});

type BaseArbeidsgiverensVirksomhetFormData = z.infer<
  typeof baseArbeidsgiverensVirksomhetSchema
>;

function validerBemanningsEllerVikarbyraaPakrevd(
  data: BaseArbeidsgiverensVirksomhetFormData,
) {
  if (!data.erArbeidsgiverenOffentligVirksomhet) {
    return data.erArbeidsgiverenBemanningsEllerVikarbyraa !== undefined;
  }
  return true;
}

function validerVanligDriftPakrevd(
  data: BaseArbeidsgiverensVirksomhetFormData,
) {
  if (!data.erArbeidsgiverenOffentligVirksomhet) {
    return data.opprettholderArbeidsgivereVanligDrift !== undefined;
  }
  return true;
}

export const arbeidsgiverensVirksomhetSchema =
  baseArbeidsgiverensVirksomhetSchema
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
