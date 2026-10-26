import { BriefcaseIcon, PersonRectangleIcon } from "@navikt/aksel-icons";

import { StegKey } from "~/constants/stegKeys.ts";
import {
  StegIkon,
  StegRekkefolgeItem,
} from "~/pages/skjema/components/Fremgangsindikator.tsx";
import {
  type FlytGrunnlag,
  getUtsendtArbeidstakerFlyt,
} from "~/pages/skjema/utsendtArbeidstakerFlyt.ts";
import { Skjemadel } from "~/types/melosysSkjemaTypes.ts";

export const ARBEIDSGIVER_IKON: StegIkon = {
  icon: BriefcaseIcon,
  ariaLabel: "felles.stegGjelderArbeidsgiver",
};

export const ARBEIDSTAKER_IKON: StegIkon = {
  icon: PersonRectangleIcon,
  ariaLabel: "felles.stegGjelderArbeidstaker",
};

const ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE_STEG: StegRekkefolgeItem = {
  key: StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
  title: "arbeidsgiverensVirksomhetINorgeSteg.tittel",
  route: "/skjema/$id/arbeidsgiverens-virksomhet-i-norge",
};

const UTENLANDSOPPDRAGET_STEG: StegRekkefolgeItem = {
  key: StegKey.UTENLANDSOPPDRAGET,
  title: "utenlandsoppdragetSteg.tittel",
  route: "/skjema/$id/utenlandsoppdraget",
};

const ARBEIDSSTED_I_UTLANDET_STEG: StegRekkefolgeItem = {
  key: StegKey.ARBEIDSSTED_I_UTLANDET,
  title: "arbeidsstedIUtlandetSteg.tittel",
  route: "/skjema/$id/arbeidssted-i-utlandet",
};

const ARBEIDSTAKERENS_LONN_STEG: StegRekkefolgeItem = {
  key: StegKey.ARBEIDSTAKERENS_LONN,
  title: "arbeidstakerenslonnSteg.tittel",
  route: "/skjema/$id/arbeidstakerens-lonn",
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
};

const SKATTEFORHOLD_OG_INNTEKT_STEG: StegRekkefolgeItem = {
  key: StegKey.SKATTEFORHOLD_OG_INNTEKT,
  title: "skatteforholdOgInntektSteg.tittel",
  route: "/skjema/$id/skatteforhold-og-inntekt",
};

const FAMILIEMEDLEMMER_STEG: StegRekkefolgeItem = {
  key: StegKey.FAMILIEMEDLEMMER,
  title: "familiemedlemmerSteg.tittel",
  route: "/skjema/$id/familiemedlemmer",
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
    {
      ...ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE_STEG,
      icon: ARBEIDSGIVER_IKON,
    },
    { ...UTENLANDSOPPDRAGET_STEG, icon: ARBEIDSGIVER_IKON },
    { ...ARBEIDSSTED_I_UTLANDET_STEG, icon: ARBEIDSGIVER_IKON },
    { ...ARBEIDSTAKERENS_LONN_STEG, icon: ARBEIDSGIVER_IKON },
    { ...ARBEIDSSITUASJON_STEG, icon: ARBEIDSTAKER_IKON },
    { ...SKATTEFORHOLD_OG_INNTEKT_STEG, icon: ARBEIDSTAKER_IKON },
    { ...FAMILIEMEDLEMMER_STEG, icon: ARBEIDSTAKER_IKON },
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

export const getStegRekkefolge = (
  skjema: FlytGrunnlag,
): StegRekkefolgeItem[] => {
  const { skjemadel } = skjema.metadata;
  const flyt = getUtsendtArbeidstakerFlyt(skjema);

  if (skjemadel === Skjemadel.ARBEIDSTAKERS_DEL) {
    return flyt.arbeidsstedSkalOppgis
      ? ARBEIDSTAKER_STEG_REKKEFOLGE.flatMap((steg) =>
          steg.key === StegKey.ARBEIDSSITUASJON
            ? [steg, ARBEIDSSTED_I_UTLANDET_STEG]
            : [steg],
        )
      : ARBEIDSTAKER_STEG_REKKEFOLGE;
  }

  const utelatteSteg = new Set<StegKey>([
    ...(skjema.metadata.erStatligArbeidsgiver === true
      ? [StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE]
      : []),
    ...(flyt.utenlandsoppdragetSkalOppgis ? [] : [StegKey.UTENLANDSOPPDRAGET]),
  ]);

  return STEG_REKKEFOLGE[skjemadel].filter(({ key }) => !utelatteSteg.has(key));
};
