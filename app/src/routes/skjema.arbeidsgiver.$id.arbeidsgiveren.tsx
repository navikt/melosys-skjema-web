import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverenSteg } from "~/pages/skjema/arbeidsgiver/arbeidsgiveren/ArbeidsgiverenSteg.tsx";

function ArbeidsgiverStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidsgiverenSteg id={id} />;
}

export const Route = createFileRoute("/skjema/arbeidsgiver/$id/arbeidsgiveren")(
  {
    component: ArbeidsgiverStegRoute,
  },
);
