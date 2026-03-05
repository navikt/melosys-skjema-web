import { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";

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
