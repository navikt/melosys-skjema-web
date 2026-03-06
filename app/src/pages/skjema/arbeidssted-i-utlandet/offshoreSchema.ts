import { z } from "zod";

import { ArbeidsstedType, TypeInnretning } from "~/types/melosysSkjemaTypes.ts";

export const offshoreSchema = z.object({
  arbeidsstedType: z.literal(ArbeidsstedType.OFFSHORE),
  offshore: z
    .object({
      navnPaVirksomhet: z
        .string({ error: "arbeidsstedIUtlandetSteg.navnPaVirksomhetErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.navnPaVirksomhetErPakrevd"),
      navnPaInnretning: z
        .string({ error: "arbeidsstedIUtlandetSteg.navnPaInnretningErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.navnPaInnretningErPakrevd"),
      typeInnretning: z.enum(TypeInnretning, {
        error: "arbeidsstedIUtlandetSteg.duMaVelgeTypeInnretning",
      }),
      sokkelLand: z
        .string({ error: "arbeidsstedIUtlandetSteg.sokkelLandErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.sokkelLandErPakrevd"),
    })
    .optional(),
});
