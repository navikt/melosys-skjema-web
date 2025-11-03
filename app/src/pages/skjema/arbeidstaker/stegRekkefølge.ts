import { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";

export const ARBEIDSTAKER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: "arbeidstakeren",
    title: "arbeidstakerenSteg.tittel",
    route: "/skjema/arbeidstaker/$id/arbeidstakeren",
  },
  {
    key: "skatteforhold-og-inntekt",
    title: "skatteforholdOgInntektSteg.tittel",
    route: "/skjema/arbeidstaker/$id/skatteforhold-og-inntekt",
  },
  {
    key: "familiemedlemmer",
    title: "familiemedlemmerSteg.tittel",
    route: "/skjema/arbeidstaker/$id/familiemedlemmer",
  },
  {
    key: "tilleggsopplysninger",
    title: "tilleggsopplysningerSteg.tittel",
    route: "/skjema/arbeidstaker/$id/tilleggsopplysninger",
  },
  {
    key: "oppsummering",
    title: "oppsummeringSteg.tittel",
    route: "/skjema/arbeidstaker/$id/oppsummering",
  },
];
