import { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";

export const ARBEIDSGIVER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: "arbeidsgiveren",
    title: "Arbeidsgiveren",
    route: "/skjema/arbeidsgiver/arbeidsgiveren",
  },
  {
    key: "arbeidsgiverens-virksomhet-i-norge",
    title: "Arbeidsgiverens virksomhet i Norge",
    route: "/skjema/arbeidsgiver/arbeidsgiverens-virksomhet-i-norge",
  },
  {
    key: "utenlandsoppdraget",
    title: "Utenlandsoppdraget",
    route: "/skjema/arbeidsgiver/utenlandsoppdraget",
  },
  {
    key: "arbeidstakerens-lonn",
    title: "Arbeidstakerens lønn",
    route: "/skjema/arbeidsgiver/arbeidstakerens-lonn",
  },
  {
    key: "oppsummering",
    title: "Oppsummering",
    route: "/skjema/arbeidsgiver/oppsummering",
  },
];
