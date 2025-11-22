import { z } from "zod";

const harNorskFodselsnummerSchema = z.object({
  harNorskFodselsnummer: z.literal(true),
  fodselsnummer: z
    .string()
    .min(
      1,
      "dineOpplysningerSteg.fodselsnummerEllerDNummerErPakrevdNarDuHarNorskFodselsnummer",
    )
    .regex(
      /^\d{11}$/,
      "dineOpplysningerSteg.fodselsnummerEllerDNummerMaVare11Siffer",
    ),
});

const harIkkeNorskFodselsnummerSchema = z.object({
  harNorskFodselsnummer: z.literal(false),
  fornavn: z
    .string()
    .min(2, "dineOpplysningerSteg.fornavnErPakrevdOgMaVareMinst2Tegn"),
  etternavn: z
    .string()
    .min(2, "dineOpplysningerSteg.etternavnErPakrevdOgMaVareMinst2Tegn"),
  fodselsdato: z.string().min(1, "dineOpplysningerSteg.fodselsdatoErPakrevd"),
});

export const dineOpplysningerSchema = z.discriminatedUnion(
  "harNorskFodselsnummer",
  [harNorskFodselsnummerSchema, harIkkeNorskFodselsnummerSchema],
);
