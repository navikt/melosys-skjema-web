import { z } from "zod";

export const arbeidsgiverensVirksomhetSchema = z
  .object({
    erArbeidsgiverenOffentligVirksomhet: z.boolean({
      error:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEnOffentligVirksomhet",
    }),
    erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean().optional(),
    opprettholderArbeidsgiverenVanligDrift: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.erArbeidsgiverenOffentligVirksomhet ||
      data.erArbeidsgiverenBemanningsEllerVikarbyraa !== undefined,
    {
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra",
      path: ["erArbeidsgiverenBemanningsEllerVikarbyraa"],
    },
  )
  .refine(
    (data) =>
      data.erArbeidsgiverenOffentligVirksomhet ||
      data.opprettholderArbeidsgiverenVanligDrift !== undefined,
    {
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge",
      path: ["opprettholderArbeidsgiverenVanligDrift"],
    },
  )
  .transform((data) => ({
    erArbeidsgiverenOffentligVirksomhet:
      data.erArbeidsgiverenOffentligVirksomhet,
    // Clear conditional fields when erArbeidsgiverenOffentligVirksomhet is true
    erArbeidsgiverenBemanningsEllerVikarbyraa:
      data.erArbeidsgiverenOffentligVirksomhet
        ? undefined
        : data.erArbeidsgiverenBemanningsEllerVikarbyraa,
    opprettholderArbeidsgiverenVanligDrift:
      data.erArbeidsgiverenOffentligVirksomhet
        ? undefined
        : data.opprettholderArbeidsgiverenVanligDrift,
  }));
