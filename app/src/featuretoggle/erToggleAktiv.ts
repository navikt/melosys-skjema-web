import type { QueryClient } from "@tanstack/react-query";

import { getFeatureTogglesQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";

import type { ToggleNavn } from "./toggleNavn.ts";

/**
 * Toggle-oppslag for route-`beforeLoad`, der hooken ikke kan brukes. Feiler hentingen,
 * eller togglen er ukjent for backend, regnes togglen som av. Uten retry, så navigasjonen
 * ikke blir hengende på en treg eller feilende toggle-tjeneste.
 */
export async function erToggleAktiv(
  queryClient: QueryClient,
  toggleNavn: ToggleNavn,
): Promise<boolean> {
  try {
    const toggles = await queryClient.ensureQueryData({
      ...getFeatureTogglesQuery(),
      retry: false,
    });
    return toggles[toggleNavn] ?? false;
  } catch {
    return false;
  }
}
