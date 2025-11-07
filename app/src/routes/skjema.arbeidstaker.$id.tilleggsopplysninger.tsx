import { createFileRoute } from "@tanstack/react-router";

import { TilleggsopplysningerSteg } from "~/pages/skjema/arbeidstaker/tilleggsopplysninger/TilleggsopplysningerSteg.tsx";

function TilleggsopplysningerStegRoute() {
  const { id } = Route.useParams();
  return <TilleggsopplysningerSteg id={id} />;
}

export const Route = createFileRoute(
  "/skjema/arbeidstaker/$id/tilleggsopplysninger",
)({
  component: TilleggsopplysningerStegRoute,
});
