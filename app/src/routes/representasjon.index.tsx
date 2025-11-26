import { createFileRoute } from "@tanstack/react-router";

import { RepresentasjonPage } from "~/pages/representasjon/RepresentasjonPage";

export const Route = createFileRoute("/representasjon/")({
  component: RepresentasjonRoute,
  beforeLoad: () => {
    return {
      hideSiteTitle: true,
    };
  },
});

function RepresentasjonRoute() {
  return <RepresentasjonPage />;
}
