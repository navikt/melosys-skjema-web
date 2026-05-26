import { StegKey } from "~/constants/stegKeys.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import type {
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidssituasjonDto,
  ArbeidsstedIUtlandetDto,
  ArbeidstakerensLonnDto,
  FamiliemedlemmerDto,
  SkatteforholdOgInntektDto,
  TilleggsopplysningerDto,
  UtenlandsoppdragetDto,
  UtsendingsperiodeOgLandDto,
  UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto,
  UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
  UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
  UtsendtArbeidstakerSkjemaDto,
  VedleggValgDto,
} from "~/types/melosysSkjemaTypes.ts";
import { Skjemadel } from "~/types/melosysSkjemaTypes.ts";

export interface ManglendeSteg {
  title: string;
  href: string;
}

// ---------------------------------------------------------------------------
// Arbeidsgiver-steg (ARBEIDSGIVERS_DEL / ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL)
// ---------------------------------------------------------------------------

export function getArbeidsgiverensVirksomhetINorge(
  skjema: UtsendtArbeidstakerSkjemaDto,
): ArbeidsgiverensVirksomhetINorgeDto | undefined {
  const { skjemadel } = skjema.metadata;
  if (skjemadel === Skjemadel.ARBEIDSGIVERS_DEL) {
    return (skjema.data as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto)
      .arbeidsgiverensVirksomhetINorge;
  }
  if (skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL) {
    return (
      skjema.data as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto
    ).arbeidsgiversData?.arbeidsgiverensVirksomhetINorge;
  }
  return undefined;
}

export function getUtenlandsoppdraget(
  skjema: UtsendtArbeidstakerSkjemaDto,
): UtenlandsoppdragetDto | undefined {
  const { skjemadel } = skjema.metadata;
  if (skjemadel === Skjemadel.ARBEIDSGIVERS_DEL) {
    return (skjema.data as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto)
      .utenlandsoppdraget;
  }
  if (skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL) {
    return (
      skjema.data as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto
    ).arbeidsgiversData?.utenlandsoppdraget;
  }
  return undefined;
}

export function getArbeidsstedIUtlandet(
  skjema: UtsendtArbeidstakerSkjemaDto,
): ArbeidsstedIUtlandetDto | undefined {
  const { skjemadel } = skjema.metadata;
  if (skjemadel === Skjemadel.ARBEIDSGIVERS_DEL) {
    return (skjema.data as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto)
      .arbeidsstedIUtlandet;
  }
  if (skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL) {
    return (
      skjema.data as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto
    ).arbeidsgiversData?.arbeidsstedIUtlandet;
  }
  return undefined;
}

export function getArbeidstakerensLonn(
  skjema: UtsendtArbeidstakerSkjemaDto,
): ArbeidstakerensLonnDto | undefined {
  const { skjemadel } = skjema.metadata;
  if (skjemadel === Skjemadel.ARBEIDSGIVERS_DEL) {
    return (skjema.data as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto)
      .arbeidstakerensLonn;
  }
  if (skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL) {
    return (
      skjema.data as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto
    ).arbeidsgiversData?.arbeidstakerensLonn;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Arbeidstaker-steg (ARBEIDSTAKERS_DEL / ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL)
// ---------------------------------------------------------------------------

export function getArbeidssituasjon(
  skjema: UtsendtArbeidstakerSkjemaDto,
): ArbeidssituasjonDto | undefined {
  const { skjemadel } = skjema.metadata;
  if (skjemadel === Skjemadel.ARBEIDSTAKERS_DEL) {
    return (skjema.data as UtsendtArbeidstakerArbeidstakersSkjemaDataDto)
      .arbeidssituasjon;
  }
  if (skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL) {
    return (
      skjema.data as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto
    ).arbeidstakersData?.arbeidssituasjon;
  }
  return undefined;
}

export function getSkatteforholdOgInntekt(
  skjema: UtsendtArbeidstakerSkjemaDto,
): SkatteforholdOgInntektDto | undefined {
  const { skjemadel } = skjema.metadata;
  if (skjemadel === Skjemadel.ARBEIDSTAKERS_DEL) {
    return (skjema.data as UtsendtArbeidstakerArbeidstakersSkjemaDataDto)
      .skatteforholdOgInntekt;
  }
  if (skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL) {
    return (
      skjema.data as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto
    ).arbeidstakersData?.skatteforholdOgInntekt;
  }
  return undefined;
}

export function getFamiliemedlemmer(
  skjema: UtsendtArbeidstakerSkjemaDto,
): FamiliemedlemmerDto | undefined {
  const { skjemadel } = skjema.metadata;
  if (skjemadel === Skjemadel.ARBEIDSTAKERS_DEL) {
    return (skjema.data as UtsendtArbeidstakerArbeidstakersSkjemaDataDto)
      .familiemedlemmer;
  }
  if (skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL) {
    return (
      skjema.data as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto
    ).arbeidstakersData?.familiemedlemmer;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Universelle steg (alle skjemadeler — felter på base-typen)
// ---------------------------------------------------------------------------

export function getTilleggsopplysninger(
  skjema: UtsendtArbeidstakerSkjemaDto,
): TilleggsopplysningerDto | undefined {
  return skjema.data.tilleggsopplysninger;
}

export function getUtsendingsperiodeOgLand(
  skjema: UtsendtArbeidstakerSkjemaDto,
): UtsendingsperiodeOgLandDto | undefined {
  return skjema.data.utsendingsperiodeOgLand;
}

export function getVedleggValg(
  skjema: UtsendtArbeidstakerSkjemaDto,
): VedleggValgDto | undefined {
  return skjema.data.vedlegg;
}

function harUtfyltSteg(
  skjema: UtsendtArbeidstakerSkjemaDto,
  stegKey: StegKey,
): boolean {
  switch (stegKey) {
    case StegKey.UTSENDINGSPERIODE_OG_LAND: {
      return Boolean(getUtsendingsperiodeOgLand(skjema));
    }
    case StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE: {
      return Boolean(getArbeidsgiverensVirksomhetINorge(skjema));
    }
    case StegKey.UTENLANDSOPPDRAGET: {
      return Boolean(getUtenlandsoppdraget(skjema));
    }
    case StegKey.ARBEIDSSTED_I_UTLANDET: {
      return Boolean(getArbeidsstedIUtlandet(skjema));
    }
    case StegKey.ARBEIDSTAKERENS_LONN: {
      return Boolean(getArbeidstakerensLonn(skjema));
    }
    case StegKey.ARBEIDSSITUASJON: {
      return Boolean(getArbeidssituasjon(skjema));
    }
    case StegKey.SKATTEFORHOLD_OG_INNTEKT: {
      return Boolean(getSkatteforholdOgInntekt(skjema));
    }
    case StegKey.FAMILIEMEDLEMMER: {
      return Boolean(getFamiliemedlemmer(skjema));
    }
    case StegKey.TILLEGGSOPPLYSNINGER: {
      return Boolean(getTilleggsopplysninger(skjema));
    }
    case StegKey.VEDLEGG: {
      return Boolean(getVedleggValg(skjema));
    }
    case StegKey.OPPSUMMERING: {
      return true;
    }
  }
}

/**
 * Finner top-level steg som ikke er fylt ut før innsending.
 * Returnerer steg i visningsrekkefølge med tittel og rute.
 */
export function finnManglendeSteg(
  skjema: UtsendtArbeidstakerSkjemaDto,
  stegRekkefolge: StegRekkefolgeItem[],
  skjemaId: string,
): ManglendeSteg[] {
  return stegRekkefolge
    .filter((steg) => !harUtfyltSteg(skjema, steg.key))
    .map((steg) => ({
      title: steg.title,
      href: steg.route.replace("$id", skjemaId),
    }));
}
