import { createFileRoute } from "@tanstack/react-router";

import { FamiliemedlemmerSteg } from "~/pages/skjema/familiemedlemmer/FamiliemedlemmerSteg.tsx";

function FamiliemedlemmerStegRoute() {
  const { id } = Route.useParams();

  return <FamiliemedlemmerSteg id={id} />;
}

export const Route = createFileRoute("/skjema/$id/familiemedlemmer")({
  component: FamiliemedlemmerStegRoute,
});
