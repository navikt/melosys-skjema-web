import { useSearch } from "@tanstack/react-router";

import {
  type RepresentasjonsKontekst,
  representasjonsKontekstSchema,
} from "~/types/representasjon.ts";

/**
 * Hook som leser representasjonskontekst fra URL search params.
 * Brukes av AppHeader og KontekstVelger som rendres i root og
 * ikke har tilgang til child-rutens validateSearch.
 */
export function useKontekst(): RepresentasjonsKontekst | undefined {
  const search = useSearch({ strict: false });
  const result = representasjonsKontekstSchema.safeParse(search);

  return result.success ? result.data : undefined;
}
