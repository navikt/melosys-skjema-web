import { z } from "zod";

import { offshoreSchema } from "./offshoreSchema.ts";
import { omBordPaFlySchema } from "./omBordPaFlySchema.ts";
import { paLandSchema } from "./paLandSchema.ts";
import { paSkipSchema } from "./paSkipSchema.ts";

// Discriminated union on arbeidsstedType, but sub-schemas use refine instead of nested discriminated unions
export const arbeidsstedIUtlandetSchema = z.discriminatedUnion(
  "arbeidsstedType",
  [paLandSchema, offshoreSchema, paSkipSchema, omBordPaFlySchema],
);
