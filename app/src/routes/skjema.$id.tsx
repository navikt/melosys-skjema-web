import { createFileRoute, Outlet } from "@tanstack/react-router";

import {
  Representasjonstype,
  UtsendtArbeidstakerMetadata,
} from "~/types/melosysSkjemaTypes.ts";

export type SkjemaType = "arbeidsgiver" | "arbeidstaker";

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

function resolveSkjemaType(
  representasjonstype: Representasjonstype,
): SkjemaType {
  return representasjonstype === Representasjonstype.DEG_SELV ||
    representasjonstype === Representasjonstype.ANNEN_PERSON
    ? "arbeidstaker"
    : "arbeidsgiver";
}

export const Route = createFileRoute("/skjema/$id")({
  beforeLoad: async ({ params }) => {
    const metadata = await fetchSkjemaMetadata(params.id);
    const skjemaType = resolveSkjemaType(metadata.representasjonstype);
    return { skjemaType };
  },
  component: SkjemaIdLayout,
});

function SkjemaIdLayout() {
  return <Outlet />;
}
