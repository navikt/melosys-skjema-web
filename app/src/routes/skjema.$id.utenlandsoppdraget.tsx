import { createFileRoute } from "@tanstack/react-router";

import { UtenlandsoppdragetSteg } from "~/pages/skjema/utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";

function UtenlandsoppdragetStegRoute() {
  const { id } = Route.useParams();

  return <UtenlandsoppdragetSteg id={id} />;
}

export const Route = createFileRoute("/skjema/$id/utenlandsoppdraget")({
  component: UtenlandsoppdragetStegRoute,
});
