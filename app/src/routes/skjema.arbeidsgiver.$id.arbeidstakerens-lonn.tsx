import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerensLonnSteg } from "~/pages/skjema/arbeidsgiver/arbeidstakerens-lonn/ArbeidstakerensLonnSteg.tsx";

function ArbeidstakerensLonnStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidstakerensLonnSteg id={id} />;
}

export const Route = createFileRoute(
  "/skjema/arbeidsgiver/$id/arbeidstakerens-lonn",
)({
  component: ArbeidstakerensLonnStegRoute,
});
