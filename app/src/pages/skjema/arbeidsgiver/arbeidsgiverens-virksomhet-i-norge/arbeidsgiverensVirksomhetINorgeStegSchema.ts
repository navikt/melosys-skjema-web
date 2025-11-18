import { z } from "zod";

// Discriminated union approach - clean and direct validation
const offentligVirksomhetSchema = z.object({
  erArbeidsgiverenOffentligVirksomhet: z.literal(true),
});

const privatVirksomhetSchema = z.object({
  erArbeidsgiverenOffentligVirksomhet: z.literal(false),
  erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean({
    message:
      "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra",
  }),
  opprettholderArbeidsgiverenVanligDrift: z.boolean({
    message:
      "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge",
  }),
});

export const arbeidsgiverensVirksomhetSchema = z
  .discriminatedUnion("erArbeidsgiverenOffentligVirksomhet", [
    offentligVirksomhetSchema,
    privatVirksomhetSchema,
  ])
  .transform((data) => ({
    erArbeidsgiverenOffentligVirksomhet: data.erArbeidsgiverenOffentligVirksomhet,
    erArbeidsgiverenBemanningsEllerVikarbyraa:
      data.erArbeidsgiverenOffentligVirksomhet
        ? undefined
        : data.erArbeidsgiverenBemanningsEllerVikarbyraa,
    opprettholderArbeidsgiverenVanligDrift:
      data.erArbeidsgiverenOffentligVirksomhet
        ? undefined
        : data.opprettholderArbeidsgiverenVanligDrift,
  }));
