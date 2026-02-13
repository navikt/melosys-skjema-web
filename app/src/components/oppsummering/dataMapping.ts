import type {
  NorskeOgUtenlandskeVirksomheter,
  NorskeOgUtenlandskeVirksomheterMedAnsettelsesform,
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
  stegKey?: string;
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

/**
 * Flater ut nestet virksomheter-struktur til en flat array
 * som matcher definisjons-elementDefinisjon.
 */
function flattenVirksomheter(
  virksomheter?:
    | NorskeOgUtenlandskeVirksomheter
    | NorskeOgUtenlandskeVirksomheterMedAnsettelsesform,
): Record<string, unknown>[] | undefined {
  if (!virksomheter) return undefined;

  const result: Record<string, unknown>[] = [];

  for (const v of virksomheter.norskeVirksomheter ?? []) {
    result.push({ organisasjonsnummer: v.organisasjonsnummer });
  }
  for (const v of virksomheter.utenlandskeVirksomheter ?? []) {
    result.push(v as unknown as Record<string, unknown>);
  }

  return result.length > 0 ? result : undefined;
}

interface SeksjonMappingEntry {
  seksjonNavn: string;
  stegKey: string;
  data: Record<string, unknown> | undefined;
}

function mapArbeidstakerSeksjoner(
  dto: UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
): SeksjonMappingEntry[] {
  return [
    {
      seksjonNavn: "utenlandsoppdragetArbeidstaker",
      stegKey: "utenlandsoppdraget",
      data: dto.utenlandsoppdraget as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "arbeidssituasjon",
      stegKey: "arbeidssituasjon",
      data: dto.arbeidssituasjon
        ? {
            ...(dto.arbeidssituasjon as unknown as Record<string, unknown>),
            virksomheterArbeidstakerJobberForIutsendelsesPeriode:
              flattenVirksomheter(
                dto.arbeidssituasjon
                  .virksomheterArbeidstakerJobberForIutsendelsesPeriode,
              ),
          }
        : undefined,
    },
    {
      seksjonNavn: "skatteforholdOgInntekt",
      stegKey: "skatteforhold-og-inntekt",
      data: dto.skatteforholdOgInntekt as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "familiemedlemmer",
      stegKey: "familiemedlemmer",
      data: dto.familiemedlemmer as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "tilleggsopplysningerArbeidstaker",
      stegKey: "tilleggsopplysninger",
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
      stegKey: "arbeidsgiverens-virksomhet-i-norge",
      data: dto.arbeidsgiverensVirksomhetINorge as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "utenlandsoppdragetArbeidsgiver",
      stegKey: "utenlandsoppdraget",
      data: dto.utenlandsoppdraget as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "arbeidsstedIUtlandet",
      stegKey: "arbeidssted-i-utlandet",
      data: dto.arbeidsstedIUtlandet as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "arbeidsstedPaLand",
      stegKey: "arbeidssted-i-utlandet",
      data: flattenPaLand(dto.arbeidsstedIUtlandet?.paLand),
    },
    {
      seksjonNavn: "arbeidsstedOffshore",
      stegKey: "arbeidssted-i-utlandet",
      data: dto.arbeidsstedIUtlandet?.offshore as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "arbeidsstedPaSkip",
      stegKey: "arbeidssted-i-utlandet",
      data: dto.arbeidsstedIUtlandet?.paSkip as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "arbeidsstedOmBordPaFly",
      stegKey: "arbeidssted-i-utlandet",
      data: dto.arbeidsstedIUtlandet?.omBordPaFly as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "arbeidstakerensLonn",
      stegKey: "arbeidstakerens-lonn",
      data: dto.arbeidstakerensLonn
        ? {
            ...(dto.arbeidstakerensLonn as unknown as Record<string, unknown>),
            virksomheterSomUtbetalerLonnOgNaturalytelser: flattenVirksomheter(
              dto.arbeidstakerensLonn
                .virksomheterSomUtbetalerLonnOgNaturalytelser,
            ),
          }
        : undefined,
    },
    {
      seksjonNavn: "tilleggsopplysningerArbeidsgiver",
      stegKey: "tilleggsopplysninger",
      data: dto.tilleggsopplysninger as Record<string, unknown> | undefined,
    },
  ];
}

// dto.type verdier - vil bli eksponert som enum fra API i fremtiden
const ARBEIDSTAKERS_DEL = "UTSENDT_ARBEIDSTAKER_ARBEIDSTAKERS_DEL";
const ARBEIDSGIVERS_DEL = "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVERS_DEL";

function getSeksjonMappinger(
  dto:
    | UtsendtArbeidstakerArbeidstakersSkjemaDataDto
    | UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
): SeksjonMappingEntry[] {
  switch (dto.type) {
    case ARBEIDSTAKERS_DEL: {
      return mapArbeidstakerSeksjoner(
        dto as UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
      );
    }
    case ARBEIDSGIVERS_DEL: {
      return mapArbeidsgiverSeksjoner(
        dto as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
      );
    }
    default: {
      throw new Error(`Ukjent skjematype: ${dto.type}`);
    }
  }
}

/**
 * Kobler DTO-data med skjemadefinisjonens seksjoner.
 * Returnerer kun seksjoner som har både definisjon og data.
 */
export function resolveSeksjoner(
  dto:
    | UtsendtArbeidstakerArbeidstakersSkjemaDataDto
    | UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
  definisjon: SkjemaDefinisjonDto,
): ResolvedSeksjon[] {
  return getSeksjonMappinger(dto).flatMap(({ seksjonNavn, stegKey, data }) => {
    const seksjon = definisjon.seksjoner[seksjonNavn];
    if (!seksjon || !data) return [];
    return [{ seksjonNavn, seksjon, data, stegKey }];
  });
}
