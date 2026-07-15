import { queryOptions, useQuery } from "@tanstack/react-query";

import { alleToggleNavn, ToggleNavn } from "./toggleNavn.ts";

const API_PROXY_URL = `${import.meta.env.BASE_URL}api`;

export const getFeatureTogglesQuery = () =>
  queryOptions<Record<string, boolean>>({
    queryKey: ["featuretoggles"],
    queryFn: fetchFeatureToggles,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

async function fetchFeatureToggles(): Promise<Record<string, boolean>> {
  const params = new URLSearchParams();
  for (const navn of alleToggleNavn) {
    params.append("features", navn);
  }

  const response = await fetch(`${API_PROXY_URL}/featuretoggle?${params}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Returnerer toggle-status fra backend, eller undefined mens togglene lastes.
 * Bruk `useFeatureToggle(NAVN) ?? false` slik at funksjonalitet er skjult til
 * togglene er lastet.
 */
export function useFeatureToggle(toggleNavn: ToggleNavn): boolean | undefined {
  const { data } = useQuery(getFeatureTogglesQuery());
  return data?.[toggleNavn];
}
