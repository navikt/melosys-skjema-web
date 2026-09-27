import { useNavigate } from "@tanstack/react-router";

import type { OpprettUtsendtArbeidstakerSoknadRequest } from "~/types/melosysSkjemaTypes.ts";

/**
Opplysningene som trengs for å opprette en søknad, før brukeren har bekreftet.
*/
export interface NySoknad {
  request: Omit<
    OpprettUtsendtArbeidstakerSoknadRequest,
    "bekreftetRiktigeOpplysninger"
  >;
  /**
  Fullt (verifisert) navn på arbeidstaker, kun til visning på introsiden.
  */
  arbeidstakerNavn: string;
}

// Opplysningene (bl.a. fnr) holdes bare i minnet: ikke i URL-en, som ofte logges,
// og ikke i nettleserhistorikken, der de ville overlevd utlogging og oppfrisking.
// Oppfriskes introsiden, er de borte og brukeren sendes til forsiden.
const minne: { nySoknad?: NySoknad } = {};

/**
Navigerer til introsiden (/skjema/start) der brukeren bekrefter før utkastet opprettes.
*/
export function useGaTilSkjemaStart() {
  const navigate = useNavigate();
  return (nySoknad: NySoknad) => {
    minne.nySoknad = nySoknad;
    return navigate({ to: "/skjema/start" });
  };
}

export function hentNySoknad(): NySoknad | undefined {
  return minne.nySoknad;
}

export function glemNySoknad() {
  minne.nySoknad = undefined;
}
