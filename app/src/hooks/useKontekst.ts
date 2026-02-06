import { useLocation } from "@tanstack/react-router";

import {
  getRepresentasjonKontekst,
  RepresentasjonsKontekst,
} from "~/utils/sessionStorage.ts";

/**
 * Hook som leser representasjonskontekst fra sessionStorage og trigger re-render ved ruteendringer.
 * Sentraliserer logikken for å lese kontekst reaktivt.
 */
export function useKontekst(): RepresentasjonsKontekst | undefined {
  // useLocation trigger re-render ved ruteendringer, slik at kontekst leses på nytt
  useLocation();
  return getRepresentasjonKontekst();
}
