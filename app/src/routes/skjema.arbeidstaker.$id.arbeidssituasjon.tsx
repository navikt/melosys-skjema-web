import { createFileRoute } from "@tanstack/react-router";

import { ArbeidssituasjonSteg } from "~/pages/skjema/arbeidstaker/arbeidssituasjon/ArbeidssituasjonSteg.tsx";

function ArbeidssituasjonStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidssituasjonSteg id={id} />;
}

export const Route = createFileRoute(
  "/skjema/arbeidstaker/$id/arbeidssituasjon",
)({
  component: ArbeidssituasjonStegRoute,
});
