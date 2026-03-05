import { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { Skjemadel } from "~/types/melosysSkjemaTypes.ts";

export const ARBEIDSGIVER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: "arbeidsgiverens-virksomhet-i-norge",
    title: "arbeidsgiverensVirksomhetINorgeSteg.tittel",
    route: "/skjema/$id/arbeidsgiverens-virksomhet-i-norge",
  },
  {
    key: "utenlandsoppdraget",
    title: "utenlandsoppdragetSteg.tittel",
    route: "/skjema/$id/utenlandsoppdraget",
  },
  {
    key: "arbeidssted-i-utlandet",
    title: "arbeidsstedIUtlandetSteg.tittel",
    route: "/skjema/$id/arbeidssted-i-utlandet",
  },
  {
    key: "arbeidstakerens-lonn",
    title: "arbeidstakerenslonnSteg.tittel",
    route: "/skjema/$id/arbeidstakerens-lonn",
  },
  {
    key: "tilleggsopplysninger",
    title: "tilleggsopplysningerSteg.tittel",
    route: "/skjema/$id/tilleggsopplysninger",
  },
  {
    key: "vedlegg",
    title: "vedleggSteg.tittel",
    route: "/skjema/$id/vedlegg",
  },
  {
    key: "oppsummering",
    title: "oppsummeringSteg.tittel",
    route: "/skjema/$id/oppsummering",
  },
];

export const ARBEIDSTAKER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: "utsendingsperiode-og-land",
    title: "utenlandsoppdragetArbeidstakerSteg.tittel",
    route: "/skjema/$id/utsendingsperiode-og-land",
  },
  {
    key: "arbeidssituasjon",
    title: "arbeidssituasjonSteg.tittel",
    route: "/skjema/$id/arbeidssituasjon",
  },
  {
    key: "skatteforhold-og-inntekt",
    title: "skatteforholdOgInntektSteg.tittel",
    route: "/skjema/$id/skatteforhold-og-inntekt",
  },
  {
    key: "familiemedlemmer",
    title: "familiemedlemmerSteg.tittel",
    route: "/skjema/$id/familiemedlemmer",
  },
  {
    key: "tilleggsopplysninger",
    title: "tilleggsopplysningerSteg.tittel",
    route: "/skjema/$id/tilleggsopplysninger",
  },
  {
    key: "vedlegg",
    title: "vedleggSteg.tittel",
    route: "/skjema/$id/vedlegg",
  },
  {
    key: "oppsummering",
    title: "oppsummeringSteg.tittel",
    route: "/skjema/$id/oppsummering",
  },
];

export const ARBEIDSGIVER_OG_ARBEIDSTAKER_STEG_REKKEFOLGE: StegRekkefolgeItem[] =
  [];

export const STEG_REKKEFOLGE: Record<Skjemadel, StegRekkefolgeItem[]> = {
  [Skjemadel.ARBEIDSGIVERS_DEL]: ARBEIDSGIVER_STEG_REKKEFOLGE,
  [Skjemadel.ARBEIDSTAKERS_DEL]: ARBEIDSTAKER_STEG_REKKEFOLGE,
  [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL]:
    ARBEIDSGIVER_OG_ARBEIDSTAKER_STEG_REKKEFOLGE,
};
