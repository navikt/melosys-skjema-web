import { createFileRoute } from "@tanstack/react-router";

import { KvitteringPage } from "~/pages/skjema/kvittering/KvitteringPage.tsx";

function KvitteringRoute() {
  const { id } = Route.useParams();
  return <KvitteringPage id={id} />;
}

export const Route = createFileRoute("/skjema/$id/kvittering")({
  component: KvitteringRoute,
});
