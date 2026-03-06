import { z } from "zod";

import { periodeSchema } from "~/components/date/periodeSchema.ts";
import { LandKode } from "~/types/melosysSkjemaTypes.ts";

export const utsendingsperiodeOgLandSchema = z.object({
  utsendelseLand: z.enum(LandKode, {
    error: "utsendingsperiodeOgLandSteg.duMaVelgeHvilketLandDuSkalUtforeArbeid",
  }),

  utsendelsePeriode: periodeSchema,
});
