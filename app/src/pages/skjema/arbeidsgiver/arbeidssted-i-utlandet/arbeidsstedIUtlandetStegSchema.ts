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

// Export the discriminated union directly - no transforms or refines needed!
// Discriminated unions automatically validate structure and ensure type safety
export const arbeidsstedIUtlandetSchema = z.discriminatedUnion(
  "arbeidsstedType",
  [paLandSchema, offshoreSchema, paSkipSchema, omBordPaFlySchema],
);
