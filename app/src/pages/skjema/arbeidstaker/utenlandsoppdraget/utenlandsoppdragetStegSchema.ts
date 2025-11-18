import { z } from "zod";

export const utenlandsoppdragSchema = z
  .object({
    utsendelsesLand: z
      .string({
        error:
          "utenlandsoppdragetArbeidstakerSteg.duMaVelgeHvilketLandDuSkalUtforeArbeid",
      })
      .min(
        1,
        "utenlandsoppdragetArbeidstakerSteg.duMaVelgeHvilketLandDuSkalUtforeArbeid",
      )
      .optional(),

    utsendelseFraDato: z
      .string()
      .min(1, "utenlandsoppdragetArbeidstakerSteg.fraDatoErPakrevd")
      .optional(),

    utsendelseTilDato: z
      .string()
      .min(1, "utenlandsoppdragetArbeidstakerSteg.tilDatoErPakrevd")
      .optional(),
  })
  .refine((data) => data.utsendelseFraDato !== undefined, {
    error: "utenlandsoppdragetArbeidstakerSteg.fraDatoErPakrevd",
    path: ["utsendelseFraDato"],
  })
  .refine((data) => data.utsendelseTilDato !== undefined, {
    error: "utenlandsoppdragetArbeidstakerSteg.tilDatoErPakrevd",
    path: ["utsendelseTilDato"],
  })
  .refine(
    (data) =>
      data.utsendelseFraDato &&
      data.utsendelseTilDato &&
      new Date(data.utsendelseFraDato) <= new Date(data.utsendelseTilDato),
    {
      error: "utenlandsoppdragetArbeidstakerSteg.tilDatoKanIkkeVareForFraDato",
      path: ["utsendelseTilDato"],
    },
  )
  .transform((data) => ({
    utsendelsesLand: data.utsendelsesLand!,
    utsendelseFraDato: data.utsendelseFraDato!,
    utsendelseTilDato: data.utsendelseTilDato!,
  }));
