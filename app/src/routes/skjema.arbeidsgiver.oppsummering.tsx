import { createFileRoute } from "@tanstack/react-router";

import { OppsummeringSteg } from "~/pages/skjema/OppsummeringSteg";

export const Route = createFileRoute("/skjema/arbeidsgiver/oppsummering")({
  component: OppsummeringSteg,
});
