import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerenSteg } from "~/pages/skjema/arbeidstaker/ArbeidstakerenSteg.tsx";

export const Route = createFileRoute("/skjema/arbeidstaker/arbeidstakeren")({
  component: ArbeidstakerenSteg,
});
