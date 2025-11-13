import { z } from "zod";

// PA_LAND schemas with nested discriminated union for FAST vs VEKSLENDE
const paLandFastSchema = z.object({
  fastEllerVekslendeArbeidssted: z.literal("FAST"),
  fastArbeidssted: z.object({
    vegadresse: z
      .string("arbeidsstedIUtlandetSteg.vegadresseErPakrevd")
      .min(1, "arbeidsstedIUtlandetSteg.vegadresseErPakrevd"),
    nummer: z
      .string("arbeidsstedIUtlandetSteg.nummerErPakrevd")
      .min(1, "arbeidsstedIUtlandetSteg.nummerErPakrevd"),
    postkode: z
      .string("arbeidsstedIUtlandetSteg.postkodeErPakrevd")
      .min(1, "arbeidsstedIUtlandetSteg.postkodeErPakrevd"),
    bySted: z
      .string("arbeidsstedIUtlandetSteg.byStedErPakrevd")
      .min(1, "arbeidsstedIUtlandetSteg.byStedErPakrevd"),
  }),
  erHjemmekontor: z.boolean({
    message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
  }),
});

const paLandVekslendeSchema = z.object({
  fastEllerVekslendeArbeidssted: z.literal("VEKSLENDE"),
  beskrivelseVekslende: z
    .string("arbeidsstedIUtlandetSteg.beskrivelseErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.beskrivelseErPakrevd"),
  erHjemmekontor: z.boolean({
    message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
  }),
});

const paLandArbeidsstedSchema = z.discriminatedUnion(
  "fastEllerVekslendeArbeidssted",
  [paLandFastSchema, paLandVekslendeSchema],
);

const paLandSchema = z.object({
  arbeidsstedType: z.literal("PA_LAND"),
  paLand: paLandArbeidsstedSchema,
});

// OFFSHORE schema
const offshoreSchema = z.object({
  arbeidsstedType: z.literal("OFFSHORE"),
  offshore: z.object({
    navnPaInnretning: z
      .string("arbeidsstedIUtlandetSteg.navnPaInnretningErPakrevd")
      .min(1, "arbeidsstedIUtlandetSteg.navnPaInnretningErPakrevd"),
    typeInnretning: z.enum(
      [
        "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING",
        "BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING",
      ],
      {
        message: "arbeidsstedIUtlandetSteg.duMaVelgeTypeInnretning",
      },
    ),
    sokkelLand: z
      .string("arbeidsstedIUtlandetSteg.sokkelLandErPakrevd")
      .min(1, "arbeidsstedIUtlandetSteg.sokkelLandErPakrevd"),
  }),
});

// PA_SKIP schemas with nested discriminated union for seilerI
const paSkipInternasjonaltFarvannSchema = z.object({
  navnPaSkip: z
    .string("arbeidsstedIUtlandetSteg.navnPaSkipErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.navnPaSkipErPakrevd"),
  yrketTilArbeidstaker: z
    .string("arbeidsstedIUtlandetSteg.yrketTilArbeidstakerErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.yrketTilArbeidstakerErPakrevd"),
  seilerI: z.literal("INTERNASJONALT_FARVANN"),
  flaggland: z
    .string("arbeidsstedIUtlandetSteg.flagglandErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.flagglandErPakrevd"),
});

const paSkipTerritorialfarvannSchema = z.object({
  navnPaSkip: z
    .string("arbeidsstedIUtlandetSteg.navnPaSkipErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.navnPaSkipErPakrevd"),
  yrketTilArbeidstaker: z
    .string("arbeidsstedIUtlandetSteg.yrketTilArbeidstakerErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.yrketTilArbeidstakerErPakrevd"),
  seilerI: z.literal("TERRITORIALFARVANN"),
  territorialfarvannLand: z
    .string("arbeidsstedIUtlandetSteg.territorialfarvannLandErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.territorialfarvannLandErPakrevd"),
});

const paSkipSeilerISchema = z.discriminatedUnion("seilerI", [
  paSkipInternasjonaltFarvannSchema,
  paSkipTerritorialfarvannSchema,
]);

const paSkipSchema = z.object({
  arbeidsstedType: z.literal("PA_SKIP"),
  paSkip: paSkipSeilerISchema,
});

// OM_BORD_PA_FLY schemas with nested discriminated union for erVanligHjemmebase
const omBordPaFlyVanligHjemmebaseSchema = z.object({
  hjemmebaseLand: z
    .string("arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd"),
  hjemmebaseNavn: z
    .string("arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd"),
  erVanligHjemmebase: z.literal(true),
});

const omBordPaFlyAnnenHjemmebaseSchema = z.object({
  hjemmebaseLand: z
    .string("arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd"),
  hjemmebaseNavn: z
    .string("arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd"),
  erVanligHjemmebase: z.literal(false),
  vanligHjemmebaseLand: z
    .string("arbeidsstedIUtlandetSteg.vanligHjemmebaseLandErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.vanligHjemmebaseLandErPakrevd"),
  vanligHjemmebaseNavn: z
    .string("arbeidsstedIUtlandetSteg.vanligHjemmebaseNavnErPakrevd")
    .min(1, "arbeidsstedIUtlandetSteg.vanligHjemmebaseNavnErPakrevd"),
});

const omBordPaFlyHjemmebaseSchema = z.discriminatedUnion("erVanligHjemmebase", [
  omBordPaFlyVanligHjemmebaseSchema,
  omBordPaFlyAnnenHjemmebaseSchema,
]);

const omBordPaFlySchema = z.object({
  arbeidsstedType: z.literal("OM_BORD_PA_FLY"),
  omBordPaFly: omBordPaFlyHjemmebaseSchema,
});

// Main discriminated union
const arbeidsstedIUtlandetDiscriminatedSchema = z.discriminatedUnion(
  "arbeidsstedType",
  [paLandSchema, offshoreSchema, paSkipSchema, omBordPaFlySchema],
);

// Wrapper to handle undefined arbeidsstedType with better error message
const baseSchema = z.looseObject({
  arbeidsstedType: z.string().optional(),
});

type InputData = z.infer<typeof baseSchema>;

export const arbeidsstedIUtlandetSchema = baseSchema
  .superRefine((data: InputData, ctx) => {
    // First check if arbeidsstedType is selected
    if (!data.arbeidsstedType) {
      ctx.addIssue({
        code: "custom",
        message: "arbeidsstedIUtlandetSteg.duMaVelgeArbeidsstedType",
        path: ["arbeidsstedType"],
      });
      return z.NEVER;
    }

    // Handle PA_LAND nested discriminated union
    if (data.arbeidsstedType === "PA_LAND") {
      const paLandData = data.paLand as
        | z.infer<typeof paLandArbeidsstedSchema>
        | undefined;

      // Valider erHjemmekontor tidlig siden feltet alltid er synlig i skjemaet
      if (paLandData?.erHjemmekontor === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
          path: ["paLand", "erHjemmekontor"],
        });
      }

      if (!paLandData?.fastEllerVekslendeArbeidssted) {
        ctx.addIssue({
          code: "custom",
          message: "arbeidsstedIUtlandetSteg.duMaVelgeFastEllerVekslende",
          path: ["paLand", "fastEllerVekslendeArbeidssted"],
        });
        return z.NEVER;
      }
    }

    // Handle PA_SKIP nested discriminated union
    if (data.arbeidsstedType === "PA_SKIP") {
      const paSkipData = data.paSkip as
        | z.infer<typeof paSkipSeilerISchema>
        | undefined;
      if (!paSkipData?.seilerI) {
        ctx.addIssue({
          code: "custom",
          message: "arbeidsstedIUtlandetSteg.duMaVelgeHvorSkipetSeiler",
          path: ["paSkip", "seilerI"],
        });
        return z.NEVER;
      }
    }

    // Handle OM_BORD_PA_FLY nested discriminated union
    if (data.arbeidsstedType === "OM_BORD_PA_FLY") {
      const omBordPaFlyData = data.omBordPaFly as
        | z.infer<typeof omBordPaFlyHjemmebaseSchema>
        | undefined;

      // Valider hjemmebaseLand og hjemmebaseNavn tidlig siden feltene alltid er synlige i skjemaet
      if (
        !omBordPaFlyData?.hjemmebaseLand ||
        omBordPaFlyData.hjemmebaseLand.length === 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd",
          path: ["omBordPaFly", "hjemmebaseLand"],
        });
      }

      if (
        !omBordPaFlyData?.hjemmebaseNavn ||
        omBordPaFlyData.hjemmebaseNavn.length === 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd",
          path: ["omBordPaFly", "hjemmebaseNavn"],
        });
      }

      if (omBordPaFlyData?.erVanligHjemmebase === undefined) {
        ctx.addIssue({
          code: "custom",
          message:
            "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErVanligHjemmebase",
          path: ["omBordPaFly", "erVanligHjemmebase"],
        });
        return z.NEVER;
      }
    }

    // Parse with discriminated union to get proper nested validation
    const result = arbeidsstedIUtlandetDiscriminatedSchema.safeParse(data);
    if (!result.success) {
      // Add all issues from discriminated union validation
      // Using spread operator to ensure type compatibility
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue });
      }
    }
  })
  .transform((data) => {
    // Clean up discriminated unions - only return relevant fields based on discriminators
    // Cast to validated discriminated union type for proper type inference
    const validatedData = data as z.infer<
      typeof arbeidsstedIUtlandetDiscriminatedSchema
    >;

    if (validatedData.arbeidsstedType === "PA_LAND") {
      const paLandData = validatedData.paLand;

      // Clean up nested PA_LAND discriminated union
      return paLandData.fastEllerVekslendeArbeidssted === "FAST"
        ? {
            arbeidsstedType: validatedData.arbeidsstedType,
            paLand: {
              fastEllerVekslendeArbeidssted:
                paLandData.fastEllerVekslendeArbeidssted,
              fastArbeidssted: paLandData.fastArbeidssted,
              erHjemmekontor: paLandData.erHjemmekontor,
            },
          }
        : {
            arbeidsstedType: validatedData.arbeidsstedType,
            paLand: {
              fastEllerVekslendeArbeidssted:
                paLandData.fastEllerVekslendeArbeidssted,
              beskrivelseVekslende: paLandData.beskrivelseVekslende,
              erHjemmekontor: paLandData.erHjemmekontor,
            },
          };
    }

    if (validatedData.arbeidsstedType === "OFFSHORE") {
      return {
        arbeidsstedType: validatedData.arbeidsstedType,
        offshore: validatedData.offshore,
      };
    }

    if (validatedData.arbeidsstedType === "PA_SKIP") {
      const paSkipData = validatedData.paSkip;

      // Clean up nested PA_SKIP discriminated union
      return paSkipData.seilerI === "INTERNASJONALT_FARVANN"
        ? {
            arbeidsstedType: validatedData.arbeidsstedType,
            paSkip: {
              navnPaSkip: paSkipData.navnPaSkip,
              yrketTilArbeidstaker: paSkipData.yrketTilArbeidstaker,
              seilerI: paSkipData.seilerI,
              flaggland: paSkipData.flaggland,
            },
          }
        : {
            arbeidsstedType: validatedData.arbeidsstedType,
            paSkip: {
              navnPaSkip: paSkipData.navnPaSkip,
              yrketTilArbeidstaker: paSkipData.yrketTilArbeidstaker,
              seilerI: paSkipData.seilerI,
              territorialfarvannLand: paSkipData.territorialfarvannLand,
            },
          };
    }

    if (validatedData.arbeidsstedType === "OM_BORD_PA_FLY") {
      const omBordPaFlyData = validatedData.omBordPaFly;

      // Clean up nested OM_BORD_PA_FLY discriminated union
      return omBordPaFlyData.erVanligHjemmebase
        ? {
            arbeidsstedType: validatedData.arbeidsstedType,
            omBordPaFly: {
              hjemmebaseLand: omBordPaFlyData.hjemmebaseLand,
              hjemmebaseNavn: omBordPaFlyData.hjemmebaseNavn,
              erVanligHjemmebase: omBordPaFlyData.erVanligHjemmebase,
            },
          }
        : {
            arbeidsstedType: validatedData.arbeidsstedType,
            omBordPaFly: {
              hjemmebaseLand: omBordPaFlyData.hjemmebaseLand,
              hjemmebaseNavn: omBordPaFlyData.hjemmebaseNavn,
              erVanligHjemmebase: omBordPaFlyData.erVanligHjemmebase,
              vanligHjemmebaseLand: omBordPaFlyData.vanligHjemmebaseLand,
              vanligHjemmebaseNavn: omBordPaFlyData.vanligHjemmebaseNavn,
            },
          };
    }

    return validatedData;
  });
