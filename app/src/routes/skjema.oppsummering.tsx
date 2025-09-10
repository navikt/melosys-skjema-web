import { createFileRoute } from "@tanstack/react-router";

import { OppsummeringSteg } from "~/pages/skjema/OppsummeringSteg";

export const Route = createFileRoute("/skjema/oppsummering")({
  component: OppsummeringSteg,
});
