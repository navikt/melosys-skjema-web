import { BriefcaseIcon, PersonRectangleIcon } from "@navikt/aksel-icons";

import { StegKey } from "~/constants/stegKeys.ts";
import {
  StegIkon,
  StegRekkefolgeItem,
} from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { Skjemadel } from "~/types/melosysSkjemaTypes.ts";

const ARBEIDSGIVER_IKON: StegIkon = {
  icon: BriefcaseIcon,
  ariaLabel: "felles.stegGjelderArbeidsgiver",
};

const ARBEIDSTAKER_IKON: StegIkon = {
  icon: PersonRectangleIcon,
  ariaLabel: "felles.stegGjelderArbeidstaker",
};

const ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE_STEG: StegRekkefolgeItem = {
  key: StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
  title: "arbeidsgiverensVirksomhetINorgeSteg.tittel",
  route: "/skjema/$id/arbeidsgiverens-virksomhet-i-norge",
  icon: ARBEIDSGIVER_IKON,
};

const UTENLANDSOPPDRAGET_STEG: StegRekkefolgeItem = {
  key: StegKey.UTENLANDSOPPDRAGET,
  title: "utenlandsoppdragetSteg.tittel",
  route: "/skjema/$id/utenlandsoppdraget",
  icon: ARBEIDSGIVER_IKON,
};

const ARBEIDSSTED_I_UTLANDET_STEG: StegRekkefolgeItem = {
  key: StegKey.ARBEIDSSTED_I_UTLANDET,
  title: "arbeidsstedIUtlandetSteg.tittel",
  route: "/skjema/$id/arbeidssted-i-utlandet",
  icon: ARBEIDSGIVER_IKON,
};

const ARBEIDSTAKERENS_LONN_STEG: StegRekkefolgeItem = {
  key: StegKey.ARBEIDSTAKERENS_LONN,
  title: "arbeidstakerenslonnSteg.tittel",
  route: "/skjema/$id/arbeidstakerens-lonn",
  icon: ARBEIDSGIVER_IKON,
};

const UTSENDINGSPERIODE_OG_LAND_STEG: StegRekkefolgeItem = {
  key: StegKey.UTSENDINGSPERIODE_OG_LAND,
  title: "utsendingsperiodeOgLandSteg.tittel",
  route: "/skjema/$id/utsendingsperiode-og-land",
};

const ARBEIDSSITUASJON_STEG: StegRekkefolgeItem = {
  key: StegKey.ARBEIDSSITUASJON,
  title: "arbeidssituasjonSteg.tittel",
  route: "/skjema/$id/arbeidssituasjon",
  icon: ARBEIDSTAKER_IKON,
};

const SKATTEFORHOLD_OG_INNTEKT_STEG: StegRekkefolgeItem = {
  key: StegKey.SKATTEFORHOLD_OG_INNTEKT,
  title: "skatteforholdOgInntektSteg.tittel",
  route: "/skjema/$id/skatteforhold-og-inntekt",
  icon: ARBEIDSTAKER_IKON,
};

const FAMILIEMEDLEMMER_STEG: StegRekkefolgeItem = {
  key: StegKey.FAMILIEMEDLEMMER,
  title: "familiemedlemmerSteg.tittel",
  route: "/skjema/$id/familiemedlemmer",
  icon: ARBEIDSTAKER_IKON,
};

const TILLEGGSOPPLYSNINGER_STEG: StegRekkefolgeItem = {
  key: StegKey.TILLEGGSOPPLYSNINGER,
  title: "tilleggsopplysningerSteg.tittel",
  route: "/skjema/$id/tilleggsopplysninger",
};

const VEDLEGG_STEG: StegRekkefolgeItem = {
  key: StegKey.VEDLEGG,
  title: "vedleggSteg.tittel",
  route: "/skjema/$id/vedlegg",
};

const OPPSUMMERING_STEG: StegRekkefolgeItem = {
  key: StegKey.OPPSUMMERING,
  title: "oppsummeringSteg.tittel",
  route: "/skjema/$id/oppsummering",
};

export const ARBEIDSGIVER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  UTSENDINGSPERIODE_OG_LAND_STEG,
  ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE_STEG,
  UTENLANDSOPPDRAGET_STEG,
  ARBEIDSSTED_I_UTLANDET_STEG,
  ARBEIDSTAKERENS_LONN_STEG,
  TILLEGGSOPPLYSNINGER_STEG,
  VEDLEGG_STEG,
  OPPSUMMERING_STEG,
];

export const ARBEIDSTAKER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  UTSENDINGSPERIODE_OG_LAND_STEG,
  ARBEIDSSITUASJON_STEG,
  SKATTEFORHOLD_OG_INNTEKT_STEG,
  FAMILIEMEDLEMMER_STEG,
  TILLEGGSOPPLYSNINGER_STEG,
  VEDLEGG_STEG,
  OPPSUMMERING_STEG,
];

export const ARBEIDSGIVER_OG_ARBEIDSTAKER_STEG_REKKEFOLGE: StegRekkefolgeItem[] =
  [
    UTSENDINGSPERIODE_OG_LAND_STEG,
    ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE_STEG,
    UTENLANDSOPPDRAGET_STEG,
    ARBEIDSSTED_I_UTLANDET_STEG,
    ARBEIDSTAKERENS_LONN_STEG,
    ARBEIDSSITUASJON_STEG,
    SKATTEFORHOLD_OG_INNTEKT_STEG,
    FAMILIEMEDLEMMER_STEG,
    TILLEGGSOPPLYSNINGER_STEG,
    VEDLEGG_STEG,
    OPPSUMMERING_STEG,
  ];

export const STEG_REKKEFOLGE: Record<Skjemadel, StegRekkefolgeItem[]> = {
  [Skjemadel.ARBEIDSGIVERS_DEL]: ARBEIDSGIVER_STEG_REKKEFOLGE,
  [Skjemadel.ARBEIDSTAKERS_DEL]: ARBEIDSTAKER_STEG_REKKEFOLGE,
  [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL]:
    ARBEIDSGIVER_OG_ARBEIDSTAKER_STEG_REKKEFOLGE,
};
