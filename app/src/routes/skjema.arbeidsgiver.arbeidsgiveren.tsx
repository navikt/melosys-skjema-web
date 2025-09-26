import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverSteg } from "~/pages/skjema/arbeidsgiver/ArbeidsgiverSteg.tsx";

export const Route = createFileRoute("/skjema/arbeidsgiver/arbeidsgiveren")({
  component: ArbeidsgiverSteg,
});
