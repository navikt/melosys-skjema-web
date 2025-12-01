import { z } from "zod";

export const offshoreSchema = z.object({
  arbeidsstedType: z.literal("OFFSHORE"),
  offshore: z
    .object({
      navnPaInnretning: z
        .string({ error: "arbeidsstedIUtlandetSteg.navnPaInnretningErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.navnPaInnretningErPakrevd"),
      typeInnretning: z.enum(
        [
          "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING",
          "BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING",
        ],
        {
          error: "arbeidsstedIUtlandetSteg.duMaVelgeTypeInnretning",
        },
      ),
      sokkelLand: z
        .string({ error: "arbeidsstedIUtlandetSteg.sokkelLandErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.sokkelLandErPakrevd"),
    })
    .optional(),
});
