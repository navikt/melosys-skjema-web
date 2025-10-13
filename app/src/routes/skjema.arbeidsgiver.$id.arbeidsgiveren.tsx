import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverSteg } from "~/pages/skjema/arbeidsgiver/ArbeidsgiverSteg.tsx";

function ArbeidsgiverStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidsgiverSteg id={id} />;
}

export const Route = createFileRoute("/skjema/arbeidsgiver/$id/arbeidsgiveren")(
  {
    component: ArbeidsgiverStegRoute,
  },
);
