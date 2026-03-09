import { useLocation } from "@tanstack/react-router";

import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import type { RepresentasjonsKontekst } from "~/types/representasjon.ts";

const VALID_KONTEKST_TYPES = new Set<string>([
  Representasjonstype.DEG_SELV,
  Representasjonstype.ARBEIDSGIVER,
  Representasjonstype.RADGIVER,
  Representasjonstype.ANNEN_PERSON,
]);

/**
 * Hook som leser representasjonskontekst fra URL search params.
 * Brukes av AppHeader og KontekstVelger som rendres i root og
 * ikke har tilgang til child-rutens validateSearch.
 */
export function useKontekst(): RepresentasjonsKontekst | undefined {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.searchStr);
  const kontekst = searchParams.get("kontekst");

  if (!kontekst || !VALID_KONTEKST_TYPES.has(kontekst)) {
    return undefined;
  }

  return {
    representasjonstype:
      kontekst as RepresentasjonsKontekst["representasjonstype"],
    radgiverOrgnr: searchParams.get("radgiverOrgnr") ?? undefined,
  };
}
