import { useSearch } from "@tanstack/react-router";

import {
  type Representasjonskontekst,
  representasjonskontekstSchema,
} from "~/types/representasjon.ts";

/**
 * Hook som leser representasjonskontekst fra URL search params.
 * Brukes av AppHeader og KontekstVelger som rendres i root og
 * ikke har tilgang til child-rutens validateSearch.
 */
export function useRepresentasjonskontekst():
  | Representasjonskontekst
  | undefined {
  const search = useSearch({ strict: false });
  const result = representasjonskontekstSchema.safeParse(search);

  return result.success ? result.data : undefined;
}
