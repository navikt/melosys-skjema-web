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
      ),

    utsendelseFraDato: z
      .string({
        error: "utenlandsoppdragetArbeidstakerSteg.fraDatoErPakrevd",
      })
      .min(1, "utenlandsoppdragetArbeidstakerSteg.fraDatoErPakrevd"),

    utsendelseTilDato: z
      .string({
        error: "utenlandsoppdragetArbeidstakerSteg.tilDatoErPakrevd",
      })
      .min(1, "utenlandsoppdragetArbeidstakerSteg.tilDatoErPakrevd"),
  })
  .refine(
    (data) =>
      new Date(data.utsendelseFraDato) <= new Date(data.utsendelseTilDato),
    {
      error: "utenlandsoppdragetArbeidstakerSteg.tilDatoKanIkkeVareForFraDato",
      path: ["utsendelseTilDato"],
    },
  );
