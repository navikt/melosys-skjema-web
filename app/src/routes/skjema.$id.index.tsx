import { createFileRoute } from "@tanstack/react-router";

import { SkjemaRedirect } from "~/pages/skjema/SkjemaRedirect.tsx";

export const Route = createFileRoute("/skjema/$id/")({
  component: SkjemaIndex,
});

function SkjemaIndex() {
  const { id } = Route.useParams();
  return <SkjemaRedirect id={id} />;
}
