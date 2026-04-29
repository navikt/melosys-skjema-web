import { z } from "zod";

import {
  ArbeidsstedType,
  FastEllerVekslendeArbeidssted,
} from "~/types/melosysSkjemaTypes.ts";

export const paLandSchema = z.object({
  arbeidsstedType: z.literal(ArbeidsstedType.PA_LAND),
  paLand: z
    .object({
      navnPaVirksomhet: z
        .string({ error: "arbeidsstedIUtlandetSteg.navnPaVirksomhetErPakrevd" })
        .min(1, "arbeidsstedIUtlandetSteg.navnPaVirksomhetErPakrevd"),
      fastEllerVekslendeArbeidssted: z.enum(FastEllerVekslendeArbeidssted, {
        error: "arbeidsstedIUtlandetSteg.duMaVelgeFastEllerVekslende",
      }),
      // FAST fields
      fastArbeidssted: z
        .object({
          vegadresse: z.string().optional(),
          nummer: z.string().optional(),
          postkode: z.string().optional(),
          bySted: z.string().optional(),
        })
        .optional(),
      erHjemmekontor: z.boolean({
        error: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
      }),
    })
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !==
          FastEllerVekslendeArbeidssted.FAST ||
        !!data.fastArbeidssted?.vegadresse?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.vegadresseErPakrevd",
        path: ["fastArbeidssted", "vegadresse"],
        when: () => true,
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !==
          FastEllerVekslendeArbeidssted.FAST ||
        !!data.fastArbeidssted?.nummer?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.nummerErPakrevd",
        path: ["fastArbeidssted", "nummer"],
        when: () => true,
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !==
          FastEllerVekslendeArbeidssted.FAST ||
        !!data.fastArbeidssted?.postkode?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.postkodeErPakrevd",
        path: ["fastArbeidssted", "postkode"],
        when: () => true,
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !==
          FastEllerVekslendeArbeidssted.FAST ||
        !!data.fastArbeidssted?.bySted?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.byStedErPakrevd",
        path: ["fastArbeidssted", "bySted"],
        when: () => true,
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !==
          FastEllerVekslendeArbeidssted.FAST ||
        data.erHjemmekontor !== undefined,
      {
        message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
        path: ["erHjemmekontor"],
        when: () => true,
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !==
          FastEllerVekslendeArbeidssted.VEKSLENDE ||
        data.erHjemmekontor !== undefined,
      {
        message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
        path: ["erHjemmekontor"],
        when: () => true,
      },
    )
    .transform((data) => ({
      ...data,
      // Clear FAST fields when VEKSLENDE
      fastArbeidssted:
        data.fastEllerVekslendeArbeidssted ===
        FastEllerVekslendeArbeidssted.FAST
          ? data.fastArbeidssted
          : undefined,
    }))
    .optional(),
});
