import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerSkjema } from "~/pages/skjema/arbeidstaker/ArbeidstakerSkjema.tsx";

export const Route = createFileRoute("/skjema/arbeidstaker")({
  component: ArbeidstakerSkjema,
});
