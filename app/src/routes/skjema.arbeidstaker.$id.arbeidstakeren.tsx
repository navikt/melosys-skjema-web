import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerenSteg } from "~/pages/skjema/arbeidstaker/ArbeidstakerenSteg.tsx";

function ArbeidstakerenStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidstakerenSteg id={id} />;
}

export const Route = createFileRoute("/skjema/arbeidstaker/$id/arbeidstakeren")(
  {
    component: ArbeidstakerenStegRoute,
  },
);
