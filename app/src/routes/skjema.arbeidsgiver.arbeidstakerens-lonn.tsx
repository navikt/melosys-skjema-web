import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerensLonnSteg } from "~/pages/skjema/arbeidsgiver/ArbeidstakerensLonnSteg.tsx";

export const Route = createFileRoute(
  "/skjema/arbeidsgiver/arbeidstakerens-lonn",
)({
  component: ArbeidstakerensLonnSteg,
});
