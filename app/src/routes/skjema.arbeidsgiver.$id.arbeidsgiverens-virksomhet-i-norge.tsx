import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverensVirksomhetINorgeSteg } from "~/pages/skjema/arbeidsgiver/ArbeidsgiverensVirksomhetINorgeSteg.tsx";

function ArbeidsgiverensVirksomhetINorgeStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidsgiverensVirksomhetINorgeSteg id={id} />;
}

export const Route = createFileRoute(
  "/skjema/arbeidsgiver/$id/arbeidsgiverens-virksomhet-i-norge",
)({
  component: ArbeidsgiverensVirksomhetINorgeStegRoute,
});
