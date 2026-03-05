import { createFileRoute } from "@tanstack/react-router";

import { TilleggsopplysningerSteg as ArbeidsgiverTilleggsopplysningerSteg } from "~/pages/skjema/arbeidsgiver/tilleggsopplysninger/TilleggsopplysningerSteg.tsx";
import { TilleggsopplysningerSteg as ArbeidstakerTilleggsopplysningerSteg } from "~/pages/skjema/arbeidstaker/tilleggsopplysninger/TilleggsopplysningerSteg.tsx";

import type { SkjemaType } from "./skjema.$id.tsx";

function TilleggsopplysningerStegRoute() {
  const { id } = Route.useParams();
  const { skjemaType } = Route.useRouteContext() as { skjemaType: SkjemaType };

  return skjemaType === "arbeidsgiver" ? (
    <ArbeidsgiverTilleggsopplysningerSteg id={id} />
  ) : (
    <ArbeidstakerTilleggsopplysningerSteg id={id} />
  );
}

export const Route = createFileRoute("/skjema/$id/tilleggsopplysninger")({
  component: TilleggsopplysningerStegRoute,
});
