import { z } from "zod";

export const arbeidsgiverensVirksomhetSchema = z.object({
  erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean({
    error:
      "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra",
  }),
  opprettholderArbeidsgiverenVanligDrift: z.boolean({
    error:
      "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge",
  }),
});
