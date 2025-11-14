import { z } from "zod";

const baseDineOpplysningerSchema = z.object({
  harNorskFodselsnummer: z.boolean().optional(),
  fodselsnummer: z.string().optional(),
  fornavn: z.string().optional(),
  etternavn: z.string().optional(),
  fodselsdato: z.string().optional(),
});

type BaseDineOpplysningerFormData = z.infer<typeof baseDineOpplysningerSchema>;

function validerFodselsdato(data: BaseDineOpplysningerFormData) {
  if (!data.harNorskFodselsnummer) {
    return data.fodselsdato && data.fodselsdato.length > 0;
  }
  return true;
}

function validerEtternavn(data: BaseDineOpplysningerFormData) {
  if (!data.harNorskFodselsnummer) {
    return data.etternavn && data.etternavn.length >= 2;
  }
  return true;
}

function validerFodselsnummer(data: BaseDineOpplysningerFormData) {
  if (data.harNorskFodselsnummer) {
    return data.fodselsnummer && data.fodselsnummer.length > 0;
  }
  return true;
}

function validerFodselsnummerFormat(data: BaseDineOpplysningerFormData) {
  if (data.fodselsnummer && data.fodselsnummer.length > 0) {
    return /^\d{11}$/.test(data.fodselsnummer);
  }
  return true;
}

function validerFornavn(data: BaseDineOpplysningerFormData) {
  if (!data.harNorskFodselsnummer) {
    return data.fornavn && data.fornavn.length >= 2;
  }
  return true;
}

function validerHarNorskFodselsnummerPakrevd(
  data: BaseDineOpplysningerFormData,
) {
  return data.harNorskFodselsnummer !== undefined;
}

export const dineOpplysningerSchema = baseDineOpplysningerSchema
  .refine(validerHarNorskFodselsnummerPakrevd, {
    message: "dineOpplysningerSteg.duMaSvarePaOmDuHarNorskFodselsnummer",
    path: ["harNorskFodselsnummer"],
  })
  .refine(validerFodselsnummer, {
    message:
      "dineOpplysningerSteg.fodselsnummerEllerDNummerErPakrevdNarDuHarNorskFodselsnummer",
    path: ["fodselsnummer"],
  })
  .refine(validerFodselsnummerFormat, {
    message: "dineOpplysningerSteg.fodselsnummerEllerDNummerMaVare11Siffer",
    path: ["fodselsnummer"],
  })
  .refine(validerFornavn, {
    message: "dineOpplysningerSteg.fornavnErPakrevdOgMaVareMinst2Tegn",
    path: ["fornavn"],
  })
  .refine(validerEtternavn, {
    message: "dineOpplysningerSteg.etternavnErPakrevdOgMaVareMinst2Tegn",
    path: ["etternavn"],
  })
  .refine(validerFodselsdato, {
    message: "dineOpplysningerSteg.fodselsdatoErPakrevd",
    path: ["fodselsdato"],
  });
