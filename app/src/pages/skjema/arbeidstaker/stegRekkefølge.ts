import { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";

export const ARBEIDSTAKER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: "dine-opplysninger",
    title: "dineOpplysningerSteg.tittel",
    route: "/skjema/arbeidstaker/$id/dine-opplysninger",
  },
  {
    key: "arbeidssituasjon",
    title: "arbeidssituasjonSteg.tittel",
    route: "/skjema/arbeidstaker/$id/arbeidssituasjon",
  },
  {
    key: "utenlandsoppdraget",
    title: "utenlandsoppdragetArbeidstakerSteg.tittel",
    route: "/skjema/arbeidstaker/$id/utenlandsoppdraget",
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
    key: "vedlegg",
    title: "vedleggSteg.tittel",
    route: "/skjema/arbeidstaker/$id/vedlegg",
  },
  {
    key: "oppsummering",
    title: "oppsummeringSteg.tittel",
    route: "/skjema/arbeidstaker/$id/oppsummering",
  },
];
