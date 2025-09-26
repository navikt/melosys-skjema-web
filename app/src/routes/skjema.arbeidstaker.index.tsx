import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerSkjemaVeiledning } from "~/pages/skjema/arbeidstaker/ArbeidstakerSkjemaVeiledning.tsx";

export const Route = createFileRoute("/skjema/arbeidstaker/")({
  component: ArbeidstakerSkjemaVeiledning,
});
