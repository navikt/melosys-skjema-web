import { createFileRoute } from "@tanstack/react-router";

import { TilleggsopplysningerSteg } from "~/pages/skjema/tilleggsopplysninger/TilleggsopplysningerSteg.tsx";

import type { SkjemaType } from "./skjema.$id.tsx";

function TilleggsopplysningerStegRoute() {
  const { id } = Route.useParams();
  const { skjemaType } = Route.useRouteContext() as { skjemaType: SkjemaType };

  return <TilleggsopplysningerSteg id={id} skjemaType={skjemaType} />;
}

export const Route = createFileRoute("/skjema/$id/tilleggsopplysninger")({
  component: TilleggsopplysningerStegRoute,
});
