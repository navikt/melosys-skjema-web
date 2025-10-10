import { createFileRoute } from "@tanstack/react-router";

import { UtenlandsoppdragetSteg } from "~/pages/skjema/arbeidsgiver/UtenlandsoppdragetSteg.tsx";

function UtenlandsoppdragetStegRoute() {
  const { id } = Route.useParams();
  return <UtenlandsoppdragetSteg id={id} />;
}

export const Route = createFileRoute(
  "/skjema/arbeidsgiver/$id/utenlandsoppdraget",
)({
  component: UtenlandsoppdragetStegRoute,
});
