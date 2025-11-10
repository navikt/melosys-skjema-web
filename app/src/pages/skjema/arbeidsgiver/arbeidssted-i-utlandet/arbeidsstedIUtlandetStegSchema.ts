import { z } from "zod";

// På land schemas
const paLandFastArbeidsstedSchema = z.object({
  vegadresse: z.string().optional(),
  nummer: z.string().optional(),
  postkode: z.string().optional(),
  bySted: z.string().optional(),
});

const paLandSchema = z.object({
  fastEllerVekslendeArbeidssted: z
    .enum(["FAST", "VEKSLENDE"], {
      message: "arbeidsstedIUtlandetSteg.duMaVelgeFastEllerVekslende",
    })
    .optional(),
  fastArbeidssted: paLandFastArbeidsstedSchema.optional(),
  beskrivelseVekslende: z.string().optional(),
  erHjemmekontor: z
    .boolean({
      message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
    })
    .optional(),
});

// Offshore schemas
const offshoreSchema = z.object({
  navnPaInnretning: z
    .string({
      message: "arbeidsstedIUtlandetSteg.navnPaInnretningErPakrevd",
    })
    .optional(),
  typeInnretning: z
    .enum(
      [
        "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING",
        "BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING",
      ],
      {
        message: "arbeidsstedIUtlandetSteg.duMaVelgeTypeInnretning",
      },
    )
    .optional(),
  sokkelLand: z
    .string({
      message: "arbeidsstedIUtlandetSteg.sokkelLandErPakrevd",
    })
    .optional(),
});

// På skip schemas
const paSkipSchema = z.object({
  navnPaSkip: z
    .string({
      message: "arbeidsstedIUtlandetSteg.navnPaSkipErPakrevd",
    })
    .optional(),
  yrketTilArbeidstaker: z
    .string({
      message: "arbeidsstedIUtlandetSteg.yrketTilArbeidstakerErPakrevd",
    })
    .optional(),
  seilerI: z
    .enum(["INTERNASJONALT_FARVANN", "TERRITORIALFARVANN"], {
      message: "arbeidsstedIUtlandetSteg.duMaVelgeHvorSkipetSeiler",
    })
    .optional(),
  flaggland: z
    .string({
      message: "arbeidsstedIUtlandetSteg.flagglandErPakrevd",
    })
    .optional(),
  territorialfarvannLand: z
    .string({
      message: "arbeidsstedIUtlandetSteg.territorialfarvannLandErPakrevd",
    })
    .optional(),
});

// Om bord på fly schemas
const omBordPaFlySchema = z.object({
  hjemmebaseLand: z
    .string({
      message: "arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd",
    })
    .optional(),
  hjemmebaseNavn: z
    .string({
      message: "arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd",
    })
    .optional(),
  erVanligHjemmebase: z
    .boolean({
      message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErVanligHjemmebase",
    })
    .optional(),
  vanligHjemmebaseLand: z
    .string({
      message: "arbeidsstedIUtlandetSteg.vanligHjemmebaseLandErPakrevd",
    })
    .optional(),
  vanligHjemmebaseNavn: z
    .string({
      message: "arbeidsstedIUtlandetSteg.vanligHjemmebaseNavnErPakrevd",
    })
    .optional(),
});

const baseArbeidsstedIUtlandetSchema = z.object({
  arbeidsstedType: z
    .enum(["PA_LAND", "OFFSHORE", "PA_SKIP", "OM_BORD_PA_FLY"], {
      message: "arbeidsstedIUtlandetSteg.duMaVelgeArbeidsstedType",
    })
    .optional(),
  paLand: paLandSchema.optional(),
  offshore: offshoreSchema.optional(),
  paSkip: paSkipSchema.optional(),
  omBordPaFly: omBordPaFlySchema.optional(),
});

type ArbeidsstedIUtlandetFormData = z.infer<
  typeof baseArbeidsstedIUtlandetSchema
>;

export const arbeidsstedIUtlandetSchema = baseArbeidsstedIUtlandetSchema
  .refine(validerArbeidsstedTypePakrevd, {
    message: "arbeidsstedIUtlandetSteg.duMaVelgeArbeidsstedType",
    path: ["arbeidsstedType"],
  })
  .refine(validerPaLandFastEllerVekslendePakrevd, {
    message: "arbeidsstedIUtlandetSteg.duMaVelgeFastEllerVekslende",
    path: ["paLand", "fastEllerVekslendeArbeidssted"],
  })
  .refine(validerPaLandHjemmekontorPakrevd, {
    message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor",
    path: ["paLand", "erHjemmekontor"],
  })
  .refine(validerPaLandFastArbeidsstedVegadressePakrevd, {
    message: "arbeidsstedIUtlandetSteg.vegadresseErPakrevd",
    path: ["paLand", "fastArbeidssted", "vegadresse"],
  })
  .refine(validerPaLandFastArbeidsstedNummerPakrevd, {
    message: "arbeidsstedIUtlandetSteg.nummerErPakrevd",
    path: ["paLand", "fastArbeidssted", "nummer"],
  })
  .refine(validerPaLandFastArbeidsstedPostkodePakrevd, {
    message: "arbeidsstedIUtlandetSteg.postkodeErPakrevd",
    path: ["paLand", "fastArbeidssted", "postkode"],
  })
  .refine(validerPaLandFastArbeidsstedByStedPakrevd, {
    message: "arbeidsstedIUtlandetSteg.byStedErPakrevd",
    path: ["paLand", "fastArbeidssted", "bySted"],
  })
  .refine(validerPaLandBeskrivelseVekslendePakrevd, {
    message: "arbeidsstedIUtlandetSteg.beskrivelseErPakrevd",
    path: ["paLand", "beskrivelseVekslende"],
  })
  .refine(validerOffshoreNavnPakrevd, {
    message: "arbeidsstedIUtlandetSteg.navnPaInnretningErPakrevd",
    path: ["offshore", "navnPaInnretning"],
  })
  .refine(validerOffshoreTypePakrevd, {
    message: "arbeidsstedIUtlandetSteg.duMaVelgeTypeInnretning",
    path: ["offshore", "typeInnretning"],
  })
  .refine(validerOffshoreSokkelLandPakrevd, {
    message: "arbeidsstedIUtlandetSteg.sokkelLandErPakrevd",
    path: ["offshore", "sokkelLand"],
  })
  .refine(validerPaSkipNavnPakrevd, {
    message: "arbeidsstedIUtlandetSteg.navnPaSkipErPakrevd",
    path: ["paSkip", "navnPaSkip"],
  })
  .refine(validerPaSkipYrketTilArbeidstakerPakrevd, {
    message: "arbeidsstedIUtlandetSteg.yrketTilArbeidstakerErPakrevd",
    path: ["paSkip", "yrketTilArbeidstaker"],
  })
  .refine(validerPaSkipSeilerIPakrevd, {
    message: "arbeidsstedIUtlandetSteg.duMaVelgeHvorSkipetSeiler",
    path: ["paSkip", "seilerI"],
  })
  .refine(validerPaSkipFlagglandPakrevd, {
    message: "arbeidsstedIUtlandetSteg.flagglandErPakrevd",
    path: ["paSkip", "flaggland"],
  })
  .refine(validerPaSkipTerritorialfarvannLandPakrevd, {
    message: "arbeidsstedIUtlandetSteg.territorialfarvannLandErPakrevd",
    path: ["paSkip", "territorialfarvannLand"],
  })
  .refine(validerOmBordPaFlyHjemmebaseLandPakrevd, {
    message: "arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd",
    path: ["omBordPaFly", "hjemmebaseLand"],
  })
  .refine(validerOmBordPaFlyHjemmebaseNavnPakrevd, {
    message: "arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd",
    path: ["omBordPaFly", "hjemmebaseNavn"],
  })
  .refine(validerOmBordPaFlyErVanligHjemmebasePakrevd, {
    message: "arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErVanligHjemmebase",
    path: ["omBordPaFly", "erVanligHjemmebase"],
  })
  .refine(validerOmBordPaFlyVanligHjemmebaseLandPakrevd, {
    message: "arbeidsstedIUtlandetSteg.vanligHjemmebaseLandErPakrevd",
    path: ["omBordPaFly", "vanligHjemmebaseLand"],
  })
  .refine(validerOmBordPaFlyVanligHjemmebaseNavnPakrevd, {
    message: "arbeidsstedIUtlandetSteg.vanligHjemmebaseNavnErPakrevd",
    path: ["omBordPaFly", "vanligHjemmebaseNavn"],
  });

// Validation functions
function validerArbeidsstedTypePakrevd(data: ArbeidsstedIUtlandetFormData) {
  return data.arbeidsstedType !== undefined;
}

function validerPaLandFastEllerVekslendePakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (data.arbeidsstedType === "PA_LAND") {
    return data.paLand?.fastEllerVekslendeArbeidssted !== undefined;
  }
  return true;
}

function validerPaLandHjemmekontorPakrevd(data: ArbeidsstedIUtlandetFormData) {
  if (data.arbeidsstedType === "PA_LAND") {
    return data.paLand?.erHjemmekontor !== undefined;
  }
  return true;
}

function validerPaLandFastArbeidsstedVegadressePakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (
    data.arbeidsstedType === "PA_LAND" &&
    data.paLand?.fastEllerVekslendeArbeidssted === "FAST"
  ) {
    return (
      data.paLand.fastArbeidssted?.vegadresse !== undefined &&
      data.paLand.fastArbeidssted.vegadresse.trim().length > 0
    );
  }
  return true;
}

function validerPaLandFastArbeidsstedNummerPakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (
    data.arbeidsstedType === "PA_LAND" &&
    data.paLand?.fastEllerVekslendeArbeidssted === "FAST"
  ) {
    return (
      data.paLand.fastArbeidssted?.nummer !== undefined &&
      data.paLand.fastArbeidssted.nummer.trim().length > 0
    );
  }
  return true;
}

function validerPaLandFastArbeidsstedPostkodePakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (
    data.arbeidsstedType === "PA_LAND" &&
    data.paLand?.fastEllerVekslendeArbeidssted === "FAST"
  ) {
    return (
      data.paLand.fastArbeidssted?.postkode !== undefined &&
      data.paLand.fastArbeidssted.postkode.trim().length > 0
    );
  }
  return true;
}

function validerPaLandFastArbeidsstedByStedPakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (
    data.arbeidsstedType === "PA_LAND" &&
    data.paLand?.fastEllerVekslendeArbeidssted === "FAST"
  ) {
    return (
      data.paLand.fastArbeidssted?.bySted !== undefined &&
      data.paLand.fastArbeidssted.bySted.trim().length > 0
    );
  }
  return true;
}

function validerPaLandBeskrivelseVekslendePakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (
    data.arbeidsstedType === "PA_LAND" &&
    data.paLand?.fastEllerVekslendeArbeidssted === "VEKSLENDE"
  ) {
    return (
      data.paLand.beskrivelseVekslende !== undefined &&
      data.paLand.beskrivelseVekslende.trim().length > 0
    );
  }
  return true;
}

function validerOffshoreNavnPakrevd(data: ArbeidsstedIUtlandetFormData) {
  if (data.arbeidsstedType === "OFFSHORE") {
    return (
      data.offshore?.navnPaInnretning !== undefined &&
      data.offshore.navnPaInnretning.trim().length > 0
    );
  }
  return true;
}

function validerOffshoreTypePakrevd(data: ArbeidsstedIUtlandetFormData) {
  if (data.arbeidsstedType === "OFFSHORE") {
    return data.offshore?.typeInnretning !== undefined;
  }
  return true;
}

function validerOffshoreSokkelLandPakrevd(data: ArbeidsstedIUtlandetFormData) {
  if (data.arbeidsstedType === "OFFSHORE") {
    return (
      data.offshore?.sokkelLand !== undefined &&
      data.offshore.sokkelLand.trim().length > 0
    );
  }
  return true;
}

function validerPaSkipNavnPakrevd(data: ArbeidsstedIUtlandetFormData) {
  if (data.arbeidsstedType === "PA_SKIP") {
    return (
      data.paSkip?.navnPaSkip !== undefined &&
      data.paSkip.navnPaSkip.trim().length > 0
    );
  }
  return true;
}

function validerPaSkipYrketTilArbeidstakerPakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (data.arbeidsstedType === "PA_SKIP") {
    return (
      data.paSkip?.yrketTilArbeidstaker !== undefined &&
      data.paSkip.yrketTilArbeidstaker.trim().length > 0
    );
  }
  return true;
}

function validerPaSkipSeilerIPakrevd(data: ArbeidsstedIUtlandetFormData) {
  if (data.arbeidsstedType === "PA_SKIP") {
    return data.paSkip?.seilerI !== undefined;
  }
  return true;
}

function validerPaSkipFlagglandPakrevd(data: ArbeidsstedIUtlandetFormData) {
  if (
    data.arbeidsstedType === "PA_SKIP" &&
    data.paSkip?.seilerI === "INTERNASJONALT_FARVANN"
  ) {
    return (
      data.paSkip.flaggland !== undefined &&
      data.paSkip.flaggland.trim().length > 0
    );
  }
  return true;
}

function validerPaSkipTerritorialfarvannLandPakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (
    data.arbeidsstedType === "PA_SKIP" &&
    data.paSkip?.seilerI === "TERRITORIALFARVANN"
  ) {
    return (
      data.paSkip.territorialfarvannLand !== undefined &&
      data.paSkip.territorialfarvannLand.trim().length > 0
    );
  }
  return true;
}

function validerOmBordPaFlyHjemmebaseLandPakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (data.arbeidsstedType === "OM_BORD_PA_FLY") {
    return (
      data.omBordPaFly?.hjemmebaseLand !== undefined &&
      data.omBordPaFly.hjemmebaseLand.trim().length > 0
    );
  }
  return true;
}

function validerOmBordPaFlyHjemmebaseNavnPakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (data.arbeidsstedType === "OM_BORD_PA_FLY") {
    return (
      data.omBordPaFly?.hjemmebaseNavn !== undefined &&
      data.omBordPaFly.hjemmebaseNavn.trim().length > 0
    );
  }
  return true;
}

function validerOmBordPaFlyErVanligHjemmebasePakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (data.arbeidsstedType === "OM_BORD_PA_FLY") {
    return data.omBordPaFly?.erVanligHjemmebase !== undefined;
  }
  return true;
}

function validerOmBordPaFlyVanligHjemmebaseLandPakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (
    data.arbeidsstedType === "OM_BORD_PA_FLY" &&
    data.omBordPaFly?.erVanligHjemmebase === false
  ) {
    return (
      data.omBordPaFly.vanligHjemmebaseLand !== undefined &&
      data.omBordPaFly.vanligHjemmebaseLand.trim().length > 0
    );
  }
  return true;
}

function validerOmBordPaFlyVanligHjemmebaseNavnPakrevd(
  data: ArbeidsstedIUtlandetFormData,
) {
  if (
    data.arbeidsstedType === "OM_BORD_PA_FLY" &&
    data.omBordPaFly?.erVanligHjemmebase === false
  ) {
    return (
      data.omBordPaFly.vanligHjemmebaseNavn !== undefined &&
      data.omBordPaFly.vanligHjemmebaseNavn.trim().length > 0
    );
  }
  return true;
}
