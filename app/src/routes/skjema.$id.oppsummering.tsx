import { createFileRoute } from "@tanstack/react-router";

import { OppsummeringSteg } from "~/pages/skjema/oppsummering/OppsummeringSteg.tsx";

function OppsummeringStegRoute() {
  const { id } = Route.useParams();

  return <OppsummeringSteg id={id} />;
}

export const Route = createFileRoute("/skjema/$id/oppsummering")({
  component: OppsummeringStegRoute,
});
