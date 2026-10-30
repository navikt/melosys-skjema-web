import { z } from "zod";

import { offshoreSchema } from "./offshoreSchema.ts";
import { omBordPaFlySchema } from "./omBordPaFlySchema.ts";
import { lagPaLandSchema } from "./paLandSchema.ts";
import { paSkipSchema } from "./paSkipSchema.ts";

// Discriminated union on arbeidsstedType, but sub-schemas use refine instead of nested discriminated unions
export const lagArbeidsstedIUtlandetSchema = ({
  statsansattFlyt,
}: {
  statsansattFlyt: boolean;
}) =>
  z.discriminatedUnion(
    "arbeidsstedType",
    [
      lagPaLandSchema({ medHjemmekontor: !statsansattFlyt }),
      offshoreSchema,
      paSkipSchema,
      omBordPaFlySchema,
    ],
    { error: "arbeidsstedIUtlandetSteg.duMaVelgeArbeidsstedType" },
  );

export const arbeidsstedIUtlandetSchema = lagArbeidsstedIUtlandetSchema({
  statsansattFlyt: false,
});
