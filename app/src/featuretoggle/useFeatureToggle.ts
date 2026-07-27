import { useQuery } from "@tanstack/react-query";

import { getFeatureTogglesQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";

import { ToggleNavn } from "./toggleNavn.ts";

/**
 * Returnerer toggle-status fra backend, eller undefined mens togglene lastes
 * (eller hvis hentingen feilet). Bruk `useFeatureToggle(NAVN) ?? false` slik at
 * funksjonalitet er skjult til togglene er lastet.
 */
export function useFeatureToggle(toggleNavn: ToggleNavn): boolean | undefined {
  const { data } = useQuery(getFeatureTogglesQuery());
  return data?.[toggleNavn];
}
