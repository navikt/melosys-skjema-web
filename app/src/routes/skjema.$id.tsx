import { createFileRoute, redirect } from "@tanstack/react-router";

const API_PROXY_URL = "/api";

type Representasjonstype =
  | "DEG_SELV"
  | "ARBEIDSGIVER"
  | "RADGIVER"
  | "ANNEN_PERSON";

// Lightweight metadata-response for routing
interface SkjemaMetadata {
  representasjonstype: Representasjonstype;
}

async function fetchSkjemaMetadata(id: string): Promise<SkjemaMetadata> {
  const response = await fetch(`${API_PROXY_URL}/skjema/${id}/metadata`);
  if (!response.ok) {
    throw new Error("Kunne ikke hente skjema-metadata");
  }
  return response.json();
}

export const Route = createFileRoute("/skjema/$id")({
  beforeLoad: async ({ params }) => {
    const { id } = params;

    // Hent metadata fra backend for å bestemme skjematype
    const metadata = await fetchSkjemaMetadata(id);

    // Bestem skjematype basert på representasjonstype
    // DEG_SELV og ANNEN_PERSON → arbeidstaker
    // ARBEIDSGIVER og RADGIVER → arbeidsgiver
    const skjemaType =
      metadata.representasjonstype === "DEG_SELV" ||
      metadata.representasjonstype === "ANNEN_PERSON"
        ? "arbeidstaker"
        : "arbeidsgiver";

    // Redirect til riktig skjematype

    throw skjemaType === "arbeidstaker"
      ? redirect({
          to: "/skjema/arbeidstaker/$id",
          params: { id },
        })
      : redirect({
          to: "/skjema/arbeidsgiver/$id",
          params: { id },
        });
  },
});
