import { z } from "zod";

const erOffentligVirksomhetSchema = z.object({
  erArbeidsgiverenOffentligVirksomhet: z.literal(true),
});

const erPrivatVirksomhetSchema = z.object({
  erArbeidsgiverenOffentligVirksomhet: z.literal(false),
  erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean(),
  opprettholderArbeidsgiverenVanligDrift: z.boolean(),
});

export const arbeidsgiverensVirksomhetSchema = z.discriminatedUnion(
  "erArbeidsgiverenOffentligVirksomhet",
  [erOffentligVirksomhetSchema, erPrivatVirksomhetSchema],
);
