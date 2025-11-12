import { createFileRoute } from "@tanstack/react-router";

import { VedleggSteg } from "~/pages/skjema/arbeidsgiver/vedlegg/VedleggSteg.tsx";

function VedleggStegRoute() {
  const { id } = Route.useParams();
  return <VedleggSteg id={id} />;
}

export const Route = createFileRoute("/skjema/arbeidsgiver/$id/vedlegg")({
  component: VedleggStegRoute,
});
