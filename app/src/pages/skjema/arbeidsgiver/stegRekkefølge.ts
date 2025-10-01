import { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";

export const ARBEIDSGIVER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: "arbeidsgiveren",
    title: "arbeidsgiverSteg.tittel",
    route: "/skjema/arbeidsgiver/arbeidsgiveren",
  },
  {
    key: "arbeidsgiverens-virksomhet-i-norge",
    title: "arbeidsgiverensVirksomhetINorgeSteg.tittel",
    route: "/skjema/arbeidsgiver/arbeidsgiverens-virksomhet-i-norge",
  },
  {
    key: "utenlandsoppdraget",
    title: "utenlandsoppdragetSteg.tittel",
    route: "/skjema/arbeidsgiver/utenlandsoppdraget",
  },
  {
    key: "arbeidstakerens-lonn",
    title: "arbeidstakerenslonnSteg.tittel",
    route: "/skjema/arbeidsgiver/arbeidstakerens-lonn",
  },
  {
    key: "oppsummering",
    title: "oppsummeringSteg.tittel",
    route: "/skjema/arbeidsgiver/oppsummering",
  },
];
