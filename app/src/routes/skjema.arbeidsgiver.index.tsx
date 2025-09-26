import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverSkjemaVeiledning } from "~/pages/skjema/arbeidsgiver/ArbeidsgiverSkjemaVeiledning.tsx";

export const Route = createFileRoute("/skjema/arbeidsgiver/")({
  component: ArbeidsgiverSkjemaVeiledning,
});
