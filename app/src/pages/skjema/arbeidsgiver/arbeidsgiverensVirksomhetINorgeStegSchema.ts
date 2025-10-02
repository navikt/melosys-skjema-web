import { z } from "zod";

export const arbeidsgiverensVirksomhetSchema = z
  .object({
    erArbeidsgiverenOffentligVirksomhet: z.boolean({
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEnOffentligVirksomhet",
    }),
    erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean().optional(),
    opprettholderArbeidsgivereVanligDrift: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (!data.erArbeidsgiverenOffentligVirksomhet) {
        return data.erArbeidsgiverenBemanningsEllerVikarbyraa !== undefined;
      }
      return true;
    },
    {
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra",
      path: ["erArbeidsgiverenBemanningsEllerVikarbyraa"],
    },
  )
  .refine(
    (data) => {
      if (!data.erArbeidsgiverenOffentligVirksomhet) {
        return data.opprettholderArbeidsgivereVanligDrift !== undefined;
      }
      return true;
    },
    {
      message:
        "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge",
      path: ["opprettholderArbeidsgivereVanligDrift"],
    },
  );
