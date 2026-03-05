import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsstedIUtlandetSteg } from "~/pages/skjema/arbeidssted-i-utlandet/ArbeidsstedIUtlandetSteg.tsx";

function ArbeidsstedIUtlandetStegRoute() {
  const { id } = Route.useParams();
  return <ArbeidsstedIUtlandetSteg id={id} />;
}

export const Route = createFileRoute("/skjema/$id/arbeidssted-i-utlandet")({
  component: ArbeidsstedIUtlandetStegRoute,
});
