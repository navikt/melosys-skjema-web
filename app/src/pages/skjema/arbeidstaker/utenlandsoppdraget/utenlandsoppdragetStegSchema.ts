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

    utsendelsePeriode: z.object({
      fraDato: z
        .string({
          error: "utenlandsoppdragetArbeidstakerSteg.fraDatoErPakrevd",
        })
        .min(1, "utenlandsoppdragetArbeidstakerSteg.fraDatoErPakrevd"),

      tilDato: z
        .string({
          error: "utenlandsoppdragetArbeidstakerSteg.tilDatoErPakrevd",
        })
        .min(1, "utenlandsoppdragetArbeidstakerSteg.tilDatoErPakrevd"),
    }),
  })
  .refine(
    (data) =>
      new Date(data.utsendelsePeriode.fraDato) <=
      new Date(data.utsendelsePeriode.tilDato),
    {
      error: "utenlandsoppdragetArbeidstakerSteg.tilDatoKanIkkeVareForFraDato",
      path: ["utsendelsePeriode", "tilDato"],
    },
  );
