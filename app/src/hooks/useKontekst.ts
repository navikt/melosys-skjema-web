import { useLocation } from "@tanstack/react-router";

import type { RepresentasjonsKontekst } from "~/types/representasjon.ts";
import { VALID_KONTEKST_TYPES } from "~/types/representasjon.ts";

const validKontekstSet = new Set<string>(VALID_KONTEKST_TYPES);

/**
 * Hook som leser representasjonskontekst fra URL search params.
 * Brukes av AppHeader og KontekstVelger som rendres i root og
 * ikke har tilgang til child-rutens validateSearch.
 */
export function useKontekst(): RepresentasjonsKontekst | undefined {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.searchStr);
  const kontekst = searchParams.get("kontekst");

  if (!kontekst || !validKontekstSet.has(kontekst)) {
    return undefined;
  }

  return {
    representasjonstype:
      kontekst as RepresentasjonsKontekst["representasjonstype"],
    radgiverOrgnr: searchParams.get("radgiverOrgnr") ?? undefined,
  };
}
