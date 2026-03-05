import { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";

export const ARBEIDSTAKER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: "utenlandsoppdraget",
    title: "utenlandsoppdragetArbeidstakerSteg.tittel",
    route: "/skjema/$id/utenlandsoppdraget",
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
