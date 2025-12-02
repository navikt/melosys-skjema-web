import { z } from "zod";

import { periodeSchema } from "~/components/date/periodeSchema.ts";

export const utenlandsoppdragSchema = z.object({
  utsendelsesLand: z
    .string({
      error:
        "utenlandsoppdragetArbeidstakerSteg.duMaVelgeHvilketLandDuSkalUtforeArbeid",
    })
    .min(
      1,
      "utenlandsoppdragetArbeidstakerSteg.duMaVelgeHvilketLandDuSkalUtforeArbeid",
    ),

  utsendelsePeriode: periodeSchema,
});
