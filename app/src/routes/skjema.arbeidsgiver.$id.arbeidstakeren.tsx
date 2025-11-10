import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerenSteg } from "~/pages/skjema/arbeidsgiver/arbeidstakeren/ArbeidstakerenSteg.tsx";

export const Route = createFileRoute("/skjema/arbeidsgiver/$id/arbeidstakeren")(
  {
    component: ArbeidstakerStegRoute,
  },
);

function ArbeidstakerStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidstakerenSteg id={id} />;
}
