import { z } from "zod";

const baseUtenlandsoppdragSchema = z.object({
  utsendelsesLand: z
    .string({
      message:
        "utenlandsoppdragetArbeidstakerSteg.duMaVelgeHvilketLandDuSkalUtforeArbeid",
    })
    .optional(),
  utsendelseFraDato: z
    .string({
      message: "utenlandsoppdragetArbeidstakerSteg.fraDatoErPakrevd",
    })
    .optional(),
  utsendelseTilDato: z
    .string({
      message: "utenlandsoppdragetArbeidstakerSteg.tilDatoErPakrevd",
    })
    .optional(),
});

type BaseUtenlandsoppdragFormData = z.infer<typeof baseUtenlandsoppdragSchema>;

function validerUtsendelsesLandPakrevd(data: BaseUtenlandsoppdragFormData) {
  return (
    data.utsendelsesLand !== undefined && data.utsendelsesLand.trim().length > 0
  );
}

function validerUtsendelseFraDatoPakrevd(data: BaseUtenlandsoppdragFormData) {
  return (
    data.utsendelseFraDato !== undefined &&
    data.utsendelseFraDato.trim().length > 0
  );
}

function validerUtsendelseTilDatoPakrevd(data: BaseUtenlandsoppdragFormData) {
  return (
    data.utsendelseTilDato !== undefined &&
    data.utsendelseTilDato.trim().length > 0
  );
}

function validerUtsendelseDatoer(data: BaseUtenlandsoppdragFormData) {
  if (data.utsendelseFraDato && data.utsendelseTilDato) {
    return new Date(data.utsendelseFraDato) <= new Date(data.utsendelseTilDato);
  }
  return true;
}

export const utenlandsoppdragSchema = baseUtenlandsoppdragSchema
  .refine(validerUtsendelsesLandPakrevd, {
    message:
      "utenlandsoppdragetArbeidstakerSteg.duMaVelgeHvilketLandDuSkalUtforeArbeid",
    path: ["utsendelsesLand"],
  })
  .refine(validerUtsendelseFraDatoPakrevd, {
    message: "utenlandsoppdragetArbeidstakerSteg.fraDatoErPakrevd",
    path: ["utsendelseFraDato"],
  })
  .refine(validerUtsendelseTilDatoPakrevd, {
    message: "utenlandsoppdragetArbeidstakerSteg.tilDatoErPakrevd",
    path: ["utsendelseTilDato"],
  })
  .refine(validerUtsendelseDatoer, {
    message: "utenlandsoppdragetArbeidstakerSteg.tilDatoKanIkkeVareForFraDato",
    path: ["utsendelseTilDato"],
  })
  .transform((data) => ({
    utsendelsesLand: data.utsendelsesLand!,
    utsendelseFraDato: data.utsendelseFraDato!,
    utsendelseTilDato: data.utsendelseTilDato!,
  }));
