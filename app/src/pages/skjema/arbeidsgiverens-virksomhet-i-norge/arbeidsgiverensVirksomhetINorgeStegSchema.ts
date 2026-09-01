import { z } from "zod";

export const arbeidsgiverensVirksomhetSchema = z.object({
  erArbeidsgiverenOffentligVirksomhet: z.boolean().optional(),
  erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean({
    error:
      "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra",
  }),
  opprettholderArbeidsgiverenVanligDrift: z.boolean({
    error:
      "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge",
  }),
});
