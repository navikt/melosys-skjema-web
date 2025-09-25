import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerSkjema } from "~/pages/skjema/ArbeidstakerSkjema";

export const Route = createFileRoute("/skjema/arbeidstaker")({
  component: ArbeidstakerSkjema,
});
