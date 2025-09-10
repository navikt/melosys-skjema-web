import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerenSteg } from "~/pages/skjema/ArbeidstakerenSteg";

export const Route = createFileRoute("/skjema/arbeidstakeren")({
  component: ArbeidstakerenSteg,
});
