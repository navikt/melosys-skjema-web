import { StegKey } from "~/constants/stegKeys.ts";
import {
  isArbeidsgiverOgArbeidstakersDel,
  isArbeidsgiversDel,
  isArbeidstakersDel,
  type SkjemaData,
} from "~/pages/skjema/types.ts";
import type {
  NorskeOgUtenlandskeVirksomheter,
  NorskeOgUtenlandskeVirksomheterMedAnsettelsesform,
  PaLandDto,
  SeksjonDefinisjonDto,
  SkjemaDefinisjonDto,
  UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto,
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
      seksjonNavn: "utsendingsperiodeOgLand",
      stegKey: StegKey.UTSENDINGSPERIODE_OG_LAND,
      data: dto.utsendingsperiodeOgLand
        ? {
            utsendelseLand: dto.utsendingsperiodeOgLand.utsendelseLand,
            utsendelsePeriode: dto.utsendingsperiodeOgLand.utsendelsePeriode,
          }
        : undefined,
    },
    {
      seksjonNavn: "arbeidssituasjon",
      stegKey: StegKey.ARBEIDSSITUASJON,
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
      stegKey: StegKey.SKATTEFORHOLD_OG_INNTEKT,
      data: dto.skatteforholdOgInntekt as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "familiemedlemmer",
      stegKey: StegKey.FAMILIEMEDLEMMER,
      data: dto.familiemedlemmer as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "tilleggsopplysningerArbeidstaker",
      stegKey: StegKey.TILLEGGSOPPLYSNINGER,
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
      stegKey: StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
      data: dto.arbeidsgiverensVirksomhetINorge as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "utenlandsoppdragetArbeidsgiver",
      stegKey: StegKey.UTENLANDSOPPDRAGET,
      data: dto.utenlandsoppdraget as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "arbeidsstedIUtlandet",
      stegKey: StegKey.ARBEIDSSTED_I_UTLANDET,
      data: dto.arbeidsstedIUtlandet as Record<string, unknown> | undefined,
    },
    {
      seksjonNavn: "arbeidsstedPaLand",
      stegKey: StegKey.ARBEIDSSTED_I_UTLANDET,
      data: flattenPaLand(dto.arbeidsstedIUtlandet?.paLand),
    },
    {
      seksjonNavn: "arbeidsstedOffshore",
      stegKey: StegKey.ARBEIDSSTED_I_UTLANDET,
      data: dto.arbeidsstedIUtlandet?.offshore as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "arbeidsstedPaSkip",
      stegKey: StegKey.ARBEIDSSTED_I_UTLANDET,
      data: dto.arbeidsstedIUtlandet?.paSkip as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "arbeidsstedOmBordPaFly",
      stegKey: StegKey.ARBEIDSSTED_I_UTLANDET,
      data: dto.arbeidsstedIUtlandet?.omBordPaFly as
        | Record<string, unknown>
        | undefined,
    },
    {
      seksjonNavn: "arbeidstakerensLonn",
      stegKey: StegKey.ARBEIDSTAKERENS_LONN,
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
      stegKey: StegKey.TILLEGGSOPPLYSNINGER,
      data: dto.tilleggsopplysninger as Record<string, unknown> | undefined,
    },
  ];
}

function mapCombinedSeksjoner(
  dto: UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto,
): SeksjonMappingEntry[] {
  return [
    ...mapArbeidsgiverSeksjoner({
      ...dto.arbeidsgiversData,
      tilleggsopplysninger: dto.tilleggsopplysninger,
    } as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto),
    ...mapArbeidstakerSeksjoner({
      ...dto.arbeidstakersData,
      utsendingsperiodeOgLand: dto.utsendingsperiodeOgLand,
      tilleggsopplysninger: dto.tilleggsopplysninger,
    } as UtsendtArbeidstakerArbeidstakersSkjemaDataDto),
  ];
}

function getSeksjonMappinger(dto: SkjemaData): SeksjonMappingEntry[] {
  if (isArbeidstakersDel(dto)) {
    return mapArbeidstakerSeksjoner(dto);
  }
  if (isArbeidsgiversDel(dto)) {
    return mapArbeidsgiverSeksjoner(dto);
  }
  if (isArbeidsgiverOgArbeidstakersDel(dto)) {
    return mapCombinedSeksjoner(dto);
  }
  throw new Error(`Ukjent skjematype: ${(dto as SkjemaData).type}`);
}

/**
 * Kobler DTO-data med skjemadefinisjonens seksjoner.
 * Returnerer kun seksjoner som har både definisjon og data.
 */
export function resolveSeksjoner(
  dto: SkjemaData,
  definisjon: SkjemaDefinisjonDto,
): ResolvedSeksjon[] {
  return getSeksjonMappinger(dto).flatMap(({ seksjonNavn, stegKey, data }) => {
    const seksjon = definisjon.seksjoner[seksjonNavn];
    if (!seksjon || !data) return [];
    return [{ seksjonNavn, seksjon, data, stegKey }];
  });
}
