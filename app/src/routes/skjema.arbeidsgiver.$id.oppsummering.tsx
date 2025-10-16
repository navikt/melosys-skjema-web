import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverOppsummeringSteg } from "~/pages/skjema/arbeidsgiver/ArbeidsgiverOppsummeringSteg.tsx";

function ArbeidsgiverOppsummeringStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidsgiverOppsummeringSteg id={id} />;
}

export const Route = createFileRoute("/skjema/arbeidsgiver/$id/oppsummering")({
  component: ArbeidsgiverOppsummeringStegRoute,
});
