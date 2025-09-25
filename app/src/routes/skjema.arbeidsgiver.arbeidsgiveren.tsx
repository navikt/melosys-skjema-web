import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverSteg } from "~/pages/skjema/ArbeidsgiverSteg";

export const Route = createFileRoute("/skjema/arbeidsgiver/arbeidsgiveren")({
  component: ArbeidsgiverSteg,
});
