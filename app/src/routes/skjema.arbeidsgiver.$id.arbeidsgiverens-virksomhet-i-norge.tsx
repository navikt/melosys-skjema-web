import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverensVirksomhetINorgeSteg } from "~/pages/skjema/arbeidsgiver/ArbeidsgiverensVirksomhetINorgeSteg.tsx";

export const Route = createFileRoute("/skjema/arbeidsgiver/$id/arbeidsgiverens-virksomhet-i-norge")({
  component: ArbeidsgiverensVirksomhetINorgeSteg,
});