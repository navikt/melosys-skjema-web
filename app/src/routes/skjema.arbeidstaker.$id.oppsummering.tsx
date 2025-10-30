import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerOppsummeringSteg } from "~/pages/skjema/arbeidstaker/ArbeidstakerOppsummeringSteg.tsx";

export const Route = createFileRoute("/skjema/arbeidstaker/$id/oppsummering")({
  component: ArbeidstakerOppsummeringStegRoute,
});

function ArbeidstakerOppsummeringStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidstakerOppsummeringSteg id={id} />;
}
