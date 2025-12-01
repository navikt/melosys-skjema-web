import { z } from "zod";

export const paLandSchema = z.object({
  arbeidsstedType: z.literal("PA_LAND"),
  paLand: z
    .object({
      fastEllerVekslendeArbeidssted: z.enum(["FAST", "VEKSLENDE"], {
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
      // VEKSLENDE fields
      beskrivelseVekslende: z.string().optional(),
    })
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !== "FAST" ||
        !!data.fastArbeidssted?.vegadresse?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.vegadresseErPakrevd",
        path: ["fastArbeidssted", "vegadresse"],
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !== "FAST" ||
        !!data.fastArbeidssted?.nummer?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.nummerErPakrevd",
        path: ["fastArbeidssted", "nummer"],
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !== "FAST" ||
        !!data.fastArbeidssted?.postkode?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.postkodeErPakrevd",
        path: ["fastArbeidssted", "postkode"],
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !== "FAST" ||
        !!data.fastArbeidssted?.bySted?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.byStedErPakrevd",
        path: ["fastArbeidssted", "bySted"],
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !== "FAST" ||
        data.erHjemmekontor !== undefined,
      {
        message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
        path: ["erHjemmekontor"],
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !== "VEKSLENDE" ||
        !!data.beskrivelseVekslende?.trim(),
      {
        message: "arbeidsstedIUtlandetSteg.beskrivelseErPakrevd",
        path: ["beskrivelseVekslende"],
      },
    )
    .refine(
      (data) =>
        data.fastEllerVekslendeArbeidssted !== "VEKSLENDE" ||
        data.erHjemmekontor !== undefined,
      {
        message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
        path: ["erHjemmekontor"],
      },
    )
    .transform((data) => ({
      fastEllerVekslendeArbeidssted: data.fastEllerVekslendeArbeidssted,
      // Clear FAST fields when VEKSLENDE
      fastArbeidssted:
        data.fastEllerVekslendeArbeidssted === "FAST"
          ? data.fastArbeidssted
          : undefined,
      erHjemmekontor: data.erHjemmekontor,
      // Clear VEKSLENDE fields when FAST
      beskrivelseVekslende:
        data.fastEllerVekslendeArbeidssted === "VEKSLENDE"
          ? data.beskrivelseVekslende
          : undefined,
    }))
    .optional(),
});
