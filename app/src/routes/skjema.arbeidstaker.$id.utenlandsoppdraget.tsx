import { createFileRoute } from "@tanstack/react-router";

import { UtenlandsoppdragetSteg } from "~/pages/skjema/arbeidstaker/utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";

function UtenlandsoppdragetStegRoute() {
  const { id } = Route.useParams();
  return <UtenlandsoppdragetSteg id={id} />;
}

export const Route = createFileRoute(
  "/skjema/arbeidstaker/$id/utenlandsoppdraget",
)({
  component: UtenlandsoppdragetStegRoute,
});
