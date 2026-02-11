import { createFileRoute } from "@tanstack/react-router";

import { InnsendtSkjemaPage } from "~/pages/skjema/innsendt/InnsendtSkjemaPage.tsx";

function InnsendtSkjemaRoute() {
  const { id } = Route.useParams();
  return <InnsendtSkjemaPage id={id} />;
}

export const Route = createFileRoute("/skjema/$id/innsendt")({
  component: InnsendtSkjemaRoute,
});
