import { createFileRoute } from "@tanstack/react-router";

import { DineOpplysningerSteg } from "~/pages/skjema/arbeidstaker/dine-opplysninger/DineOpplysningerSteg.tsx";

function DineOpplysningerStegRoute() {
  const { id } = Route.useParams();
  return <DineOpplysningerSteg id={id} />;
}

export const Route = createFileRoute(
  "/skjema/arbeidstaker/$id/dine-opplysninger",
)({
  component: DineOpplysningerStegRoute,
});
