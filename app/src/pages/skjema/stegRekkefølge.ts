import { StegKey } from "~/constants/stegKeys.ts";
import { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { Skjemadel } from "~/types/melosysSkjemaTypes.ts";

export const ARBEIDSGIVER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
    title: "arbeidsgiverensVirksomhetINorgeSteg.tittel",
    route: "/skjema/$id/arbeidsgiverens-virksomhet-i-norge",
  },
  {
    key: StegKey.UTENLANDSOPPDRAGET,
    title: "utenlandsoppdragetSteg.tittel",
    route: "/skjema/$id/utenlandsoppdraget",
  },
  {
    key: StegKey.ARBEIDSSTED_I_UTLANDET,
    title: "arbeidsstedIUtlandetSteg.tittel",
    route: "/skjema/$id/arbeidssted-i-utlandet",
  },
  {
    key: StegKey.ARBEIDSTAKERENS_LONN,
    title: "arbeidstakerenslonnSteg.tittel",
    route: "/skjema/$id/arbeidstakerens-lonn",
  },
  {
    key: StegKey.TILLEGGSOPPLYSNINGER,
    title: "tilleggsopplysningerSteg.tittel",
    route: "/skjema/$id/tilleggsopplysninger",
  },
  {
    key: StegKey.VEDLEGG,
    title: "vedleggSteg.tittel",
    route: "/skjema/$id/vedlegg",
  },
  {
    key: StegKey.OPPSUMMERING,
    title: "oppsummeringSteg.tittel",
    route: "/skjema/$id/oppsummering",
  },
];

export const ARBEIDSTAKER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: StegKey.UTSENDINGSPERIODE_OG_LAND,
    title: "utenlandsoppdragetArbeidstakerSteg.tittel",
    route: "/skjema/$id/utsendingsperiode-og-land",
  },
  {
    key: StegKey.ARBEIDSSITUASJON,
    title: "arbeidssituasjonSteg.tittel",
    route: "/skjema/$id/arbeidssituasjon",
  },
  {
    key: StegKey.SKATTEFORHOLD_OG_INNTEKT,
    title: "skatteforholdOgInntektSteg.tittel",
    route: "/skjema/$id/skatteforhold-og-inntekt",
  },
  {
    key: StegKey.FAMILIEMEDLEMMER,
    title: "familiemedlemmerSteg.tittel",
    route: "/skjema/$id/familiemedlemmer",
  },
  {
    key: StegKey.TILLEGGSOPPLYSNINGER,
    title: "tilleggsopplysningerSteg.tittel",
    route: "/skjema/$id/tilleggsopplysninger",
  },
  {
    key: StegKey.VEDLEGG,
    title: "vedleggSteg.tittel",
    route: "/skjema/$id/vedlegg",
  },
  {
    key: StegKey.OPPSUMMERING,
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
