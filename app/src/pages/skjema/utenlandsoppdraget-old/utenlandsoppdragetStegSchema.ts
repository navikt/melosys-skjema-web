import { z } from "zod";

import { periodeSchema } from "~/components/date/periodeSchema.ts";
import { LandKode } from "~/types/melosysSkjemaTypes.ts";

export const utenlandsoppdragSchema = z.object({
  utsendelsesLand: z.enum(LandKode, {
    error:
      "utenlandsoppdragetArbeidstakerSteg.duMaVelgeHvilketLandDuSkalUtforeArbeid",
  }),

  utsendelsePeriode: periodeSchema,
});
