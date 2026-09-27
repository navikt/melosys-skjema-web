import { useNavigate, useRouterState } from "@tanstack/react-router";

import type { OpprettUtsendtArbeidstakerSoknadRequest } from "~/types/melosysSkjemaTypes.ts";

/**
Opplysningene som trengs for å opprette en søknad, før brukeren har bekreftet.
*/
export type NySoknad = Omit<
  OpprettUtsendtArbeidstakerSoknadRequest,
  "bekreftetRiktigeOpplysninger"
>;

// Opplysningene (bl.a. fnr) sendes til introsiden i history state, ikke i URL-en,
// så personnummeret ikke havner i adresser eller serverlogger. Det ligger i
// nettleserens fanehistorikk til oppføringen erstattes etter opprettelse.
declare module "@tanstack/react-router" {
  interface HistoryState {
    nySoknad?: NySoknad;
  }
}

/**
Navigerer til introsiden (/skjema/start) der brukeren bekrefter før utkastet opprettes.
*/
export function useGaTilSkjemaStart() {
  const navigate = useNavigate();
  return (nySoknad: NySoknad) =>
    navigate({ to: "/skjema/start", state: { nySoknad } });
}

export function useNySoknadFraHistorikk(): NySoknad | undefined {
  return useRouterState({ select: (state) => state.location.state.nySoknad });
}
