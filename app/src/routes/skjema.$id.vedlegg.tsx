import { createFileRoute } from "@tanstack/react-router";

import { VedleggSteg } from "~/pages/skjema/vedlegg/VedleggSteg.tsx";

import type { SkjemaType } from "./skjema.$id.tsx";

function VedleggStegRoute() {
  const { id } = Route.useParams();
  const { skjemaType } = Route.useRouteContext() as { skjemaType: SkjemaType };

  return <VedleggSteg id={id} skjemaType={skjemaType} />;
}

export const Route = createFileRoute("/skjema/$id/vedlegg")({
  component: VedleggStegRoute,
});
