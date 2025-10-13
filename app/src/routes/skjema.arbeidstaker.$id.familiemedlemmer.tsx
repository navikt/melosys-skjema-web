import { createFileRoute } from "@tanstack/react-router";

import { FamiliemedlemmerSteg } from "~/pages/skjema/arbeidstaker/FamiliemedlemmerSteg.tsx";

function FamiliemedlemmerStegRoute() {
  const { id } = Route.useParams();
  return <FamiliemedlemmerSteg id={id} />;
}

export const Route = createFileRoute("/skjema/arbeidstaker/$id/familiemedlemmer")({
  component: FamiliemedlemmerStegRoute,
});