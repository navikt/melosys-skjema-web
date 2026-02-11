import type {
  PaLandDto,
  SeksjonDefinisjonDto,
  SkjemaDefinisjonDto,
  UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
  UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
} from "~/types/melosysSkjemaTypes.ts";

interface ResolvedSeksjon {
  seksjonNavn: string;
  seksjon: SeksjonDefinisjonDto;
  data: Record<string, unknown>;
}

function flattenPaLand(
  paLand?: PaLandDto,
): Record<string, unknown> | undefined {
  if (!paLand) return undefined;
  return {
    navnPaVirksomhet: paLand.navnPaVirksomhet,
    fastEllerVekslendeArbeidssted: paLand.fastEllerVekslendeArbeidssted,
    vegadresse: paLand.fastArbeidssted?.vegadresse,
    nummer: paLand.fastArbeidssted?.nummer,
    postkode: paLand.fastArbeidssted?.postkode,
    bySted: paLand.fastArbeidssted?.bySted,
    beskrivelseVekslende: paLand.beskrivelseVekslende,
    erHjemmekontor: paLand.erHjemmekontor,
  };
}

interface SeksjonMappingEntry {
  seksjonNavn: string;
  data: Record<string, unknown> | undefined;
}

function mapArbeidstakerSeksjoner(
  dto: UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
): SeksjonMappingEntry[] {
  return [
    {
      seksjonNavn: "utenlandsoppdragetArbeidstaker",
      data: dto.utenlandsoppdraget as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "arbeidssituasjon",
      data: dto.arbeidssituasjon as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "skatteforholdOgInntekt",
      data: dto.skatteforholdOgInntekt as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "familiemedlemmer",
      data: dto.familiemedlemmer as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "tilleggsopplysningerArbeidstaker",
      data: dto.tilleggsopplysninger as Record<string, unknown> | undefined,
    },
  ];
}

function mapArbeidsgiverSeksjoner(
  dto: UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
): SeksjonMappingEntry[] {
  return [
    {
      seksjonNavn: "arbeidsgiverensVirksomhetINorge",
      data: dto.arbeidsgiverensVirksomhetINorge as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "utenlandsoppdragetArbeidsgiver",
      data: dto.utenlandsoppdraget as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "arbeidsstedIUtlandet",
      data: dto.arbeidsstedIUtlandet as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "arbeidsstedPaLand",
      data: flattenPaLand(dto.arbeidsstedIUtlandet?.paLand),
    },
    {
      seksjonNavn: "arbeidsstedOffshore",
      data: dto.arbeidsstedIUtlandet?.offshore as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "arbeidsstedPaSkip",
      data: dto.arbeidsstedIUtlandet?.paSkip as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "arbeidsstedOmBordPaFly",
      data: dto.arbeidsstedIUtlandet?.omBordPaFly as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "arbeidstakerensLonn",
      data: dto.arbeidstakerensLonn as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "tilleggsopplysningerArbeidsgiver",
      data: dto.tilleggsopplysninger as Record<string, unknown> | undefined,
    },
  ];
}

/**
 * Kobler DTO-data med skjemadefinisjonens seksjoner.
 * Returnerer kun seksjoner som har både definisjon og data.
 */
export function renderSeksjoner(
  rolle: "arbeidstaker" | "arbeidsgiver",
  dto:
    | UtsendtArbeidstakerArbeidstakersSkjemaDataDto
    | UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
  definisjon: SkjemaDefinisjonDto,
): ResolvedSeksjon[] {
  const mappinger =
    rolle === "arbeidstaker"
      ? mapArbeidstakerSeksjoner(
          dto as UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
        )
      : mapArbeidsgiverSeksjoner(
          dto as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
        );

  return mappinger.flatMap(({ seksjonNavn, data }) => {
    const seksjon = definisjon.seksjoner[seksjonNavn];
    if (!seksjon || !data) return [];
    return [{ seksjonNavn, seksjon, data }];
  });
}
