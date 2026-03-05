import { createFileRoute, Outlet } from "@tanstack/react-router";

import { UtsendtArbeidstakerMetadata } from "~/types/melosysSkjemaTypes.ts";

const API_PROXY_URL = "/api";

async function fetchSkjemaMetadata(
  id: string,
): Promise<UtsendtArbeidstakerMetadata> {
  const response = await fetch(`${API_PROXY_URL}/skjema/${id}/metadata`);
  if (!response.ok) {
    throw new Error("Kunne ikke hente skjema-metadata");
  }
  return response.json();
}

export const Route = createFileRoute("/skjema/$id")({
  beforeLoad: async ({ params }) => {
    const metadata = await fetchSkjemaMetadata(params.id);
    return { skjemadel: metadata.skjemadel };
  },
  component: SkjemaIdLayout,
});

function SkjemaIdLayout() {
  return <Outlet />;
}
