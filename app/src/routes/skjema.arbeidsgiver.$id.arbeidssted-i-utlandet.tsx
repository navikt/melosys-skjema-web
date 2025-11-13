import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsstedIUtlandetSteg } from "~/pages/skjema/arbeidsgiver/arbeidssted-i-utlandet/ArbeidsstedIUtlandetSteg.tsx";

export const Route = createFileRoute(
  "/skjema/arbeidsgiver/$id/arbeidssted-i-utlandet",
)({
  component: ArbeidsstedIUtlandetStegRoute,
});

function ArbeidsstedIUtlandetStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidsstedIUtlandetSteg id={id} />;
}
