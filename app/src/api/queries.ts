import { queryOptions } from "@tanstack/react-query";

const API_PROXY_URL = "/api";

export function listSkjemaerQueryOptions() {
  return queryOptions({
    queryKey: ["SKJEMAER"],
    queryFn: fetchSkjemaer,
  });
}

async function fetchSkjemaer() {
  const response = await fetch(`${API_PROXY_URL}/skjema`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
