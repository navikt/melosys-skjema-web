import { z } from "zod";

export const paSkipSchema = z.object({
  arbeidsstedType: z.literal("PA_SKIP"),
  paSkip: z
    .object({
      navnPaSkip: z
        .string({ error: "arbeidsstedIUtlandetSteg.navnPaSkipErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.navnPaSkipErPakrevd"),
      yrketTilArbeidstaker: z
        .string({
          error: "arbeidsstedIUtlandetSteg.yrketTilArbeidstakerErPakrevd",
        })
        .min(1, "arbeidsstedIUtlandetSteg.yrketTilArbeidstakerErPakrevd"),
      seilerI: z.enum(["INTERNASJONALT_FARVANN", "TERRITORIALFARVANN"], {
        error: "arbeidsstedIUtlandetSteg.duMaVelgeHvorSkipetSeiler",
      }),
      // INTERNASJONALT_FARVANN field
      flaggland: z.string().optional(),
      // TERRITORIALFARVANN field
      territorialfarvannLand: z.string().optional(),
    })
    .refine(
      (data) =>
        data.seilerI !== "INTERNASJONALT_FARVANN" || !!data.flaggland?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.flagglandErPakrevd",
        path: ["flaggland"],
      },
    )
    .refine(
      (data) =>
        data.seilerI !== "TERRITORIALFARVANN" ||
        !!data.territorialfarvannLand?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.territorialfarvannLandErPakrevd",
        path: ["territorialfarvannLand"],
      },
    )
    .transform((data) => ({
      navnPaSkip: data.navnPaSkip,
      yrketTilArbeidstaker: data.yrketTilArbeidstaker,
      seilerI: data.seilerI,
      // Clear INTERNASJONALT_FARVANN field when TERRITORIALFARVANN
      flaggland:
        data.seilerI === "INTERNASJONALT_FARVANN" ? data.flaggland : undefined,
      // Clear TERRITORIALFARVANN field when INTERNASJONALT_FARVANN
      territorialfarvannLand:
        data.seilerI === "TERRITORIALFARVANN"
          ? data.territorialfarvannLand
          : undefined,
    }))
    .optional(),
});
