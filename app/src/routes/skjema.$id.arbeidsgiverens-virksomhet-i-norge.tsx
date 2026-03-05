import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverensVirksomhetINorgeSteg } from "~/pages/skjema/arbeidsgiverens-virksomhet-i-norge/ArbeidsgiverensVirksomhetINorgeSteg.tsx";

function ArbeidsgiverensVirksomhetINorgeStegRoute() {
  const { id } = Route.useParams();

  return <ArbeidsgiverensVirksomhetINorgeSteg id={id} />;
}

export const Route = createFileRoute(
  "/skjema/$id/arbeidsgiverens-virksomhet-i-norge",
)({
  component: ArbeidsgiverensVirksomhetINorgeStegRoute,
});
