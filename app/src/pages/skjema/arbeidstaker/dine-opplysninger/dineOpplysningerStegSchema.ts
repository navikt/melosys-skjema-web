import { z } from "zod";

// Discriminated union approach - clean and direct validation
const harNorskFodselsnummerSchema = z.object({
  harNorskFodselsnummer: z.literal(true),
  fodselsnummer: z
    .string()
    .regex(/^\d{11}$/, "dineOpplysningerSteg.fodselsnummerEllerDNummerMaVare11Siffer"),
});

const harIkkeNorskFodselsnummerSchema = z.object({
  harNorskFodselsnummer: z.literal(false),
  fornavn: z
    .string()
    .min(2, "dineOpplysningerSteg.fornavnErPakrevdOgMaVareMinst2Tegn"),
  etternavn: z
    .string()
    .min(2, "dineOpplysningerSteg.etternavnErPakrevdOgMaVareMinst2Tegn"),
  fodselsdato: z
    .string()
    .min(1, "dineOpplysningerSteg.fodselsdatoErPakrevd"),
});

export const dineOpplysningerSchema = z
  .discriminatedUnion("harNorskFodselsnummer", [
    harNorskFodselsnummerSchema,
    harIkkeNorskFodselsnummerSchema,
  ])
  .transform((data) => ({
    harNorskFodselsnummer: data.harNorskFodselsnummer,
    fodselsnummer: data.harNorskFodselsnummer ? data.fodselsnummer : undefined,
    fornavn: !data.harNorskFodselsnummer ? data.fornavn : undefined,
    etternavn: !data.harNorskFodselsnummer ? data.etternavn : undefined,
    fodselsdato: !data.harNorskFodselsnummer ? data.fodselsdato : undefined,
  }));
