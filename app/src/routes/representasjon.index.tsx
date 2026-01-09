import { createFileRoute } from "@tanstack/react-router";

import { RepresentasjonPage } from "~/pages/representasjon/RepresentasjonPage";

export const Route = createFileRoute("/representasjon/")({
  component: RepresentasjonRoute,
});

function RepresentasjonRoute() {
  return <RepresentasjonPage />;
}
