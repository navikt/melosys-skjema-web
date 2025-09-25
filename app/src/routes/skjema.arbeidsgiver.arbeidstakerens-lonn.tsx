import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerensLonnSteg } from "~/pages/skjema/ArbeidstakerensLonnSteg";

export const Route = createFileRoute(
  "/skjema/arbeidsgiver/arbeidstakerens-lonn",
)({
  component: ArbeidstakerensLonnSteg,
});
