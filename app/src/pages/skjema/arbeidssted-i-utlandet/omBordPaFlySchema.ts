import { z } from "zod";

import { ArbeidsstedType } from "~/types/melosysSkjemaTypes.ts";

export const omBordPaFlySchema = z.object({
  arbeidsstedType: z.literal(ArbeidsstedType.OM_BORD_PA_FLY),
  omBordPaFly: z
    .object({
      navnPaVirksomhet: z
        .string({ error: "arbeidsstedIUtlandetSteg.navnPaVirksomhetErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.navnPaVirksomhetErPakrevd"),
      hjemmebaseLand: z
        .string({ error: "arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd"),
      hjemmebaseNavn: z
        .string({ error: "arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd"),
      erVanligHjemmebase: z.boolean({
        error: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErVanligHjemmebase",
      }),
      vanligHjemmebaseLand: z.string().optional(),
      vanligHjemmebaseNavn: z.string().optional(),
    })
    .refine(
      (data) => data.erVanligHjemmebase || !!data.vanligHjemmebaseLand?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.vanligHjemmebaseLandErPakrevd",
        path: ["vanligHjemmebaseLand"],
      },
    )
    .refine(
      (data) => data.erVanligHjemmebase || !!data.vanligHjemmebaseNavn?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.vanligHjemmebaseNavnErPakrevd",
        path: ["vanligHjemmebaseNavn"],
      },
    )
    .transform((data) => ({
      ...data,
      // Clear fields when erVanligHjemmebase is true
      vanligHjemmebaseLand: data.erVanligHjemmebase
        ? undefined
        : data.vanligHjemmebaseLand,
      vanligHjemmebaseNavn: data.erVanligHjemmebase
        ? undefined
        : data.vanligHjemmebaseNavn,
    }))
    .optional(),
});
