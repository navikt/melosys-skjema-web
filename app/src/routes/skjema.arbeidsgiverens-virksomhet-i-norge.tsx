import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverensVirksomhetINorgeSteg } from "~/pages/skjema/ArbeidsgiverensVirksomhetINorgeSteg";

export const Route = createFileRoute(
  "/skjema/arbeidsgiverens-virksomhet-i-norge",
)({
  component: ArbeidsgiverensVirksomhetINorgeSteg,
});
