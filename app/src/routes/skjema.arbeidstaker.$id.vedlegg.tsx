import { createFileRoute } from "@tanstack/react-router";

import { VedleggSteg } from "~/pages/skjema/arbeidstaker/vedlegg/VedleggSteg.tsx";

function VedleggStegRoute() {
  const { id } = Route.useParams();
  return <VedleggSteg id={id} />;
}

export const Route = createFileRoute("/skjema/arbeidstaker/$id/vedlegg")({
  component: VedleggStegRoute,
});
