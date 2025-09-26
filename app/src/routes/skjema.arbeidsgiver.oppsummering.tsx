import { createFileRoute } from "@tanstack/react-router";

import { OppsummeringSteg } from "~/pages/skjema/arbeidsgiver/OppsummeringSteg.tsx";

export const Route = createFileRoute("/skjema/arbeidsgiver/oppsummering")({
  component: OppsummeringSteg,
});
