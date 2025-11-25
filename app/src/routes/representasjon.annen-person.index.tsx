import { createFileRoute, redirect } from "@tanstack/react-router";

import { AnnenPersonPage } from "~/pages/representasjon/annen-person/AnnenPersonPage";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/annen-person/")({
  component: AnnenPersonRoute,
  beforeLoad: () => {
    const kontekst = getRepresentasjonKontekst();

    if (!kontekst) {
      throw redirect({ to: "/" });
    }

    return {
      hideSiteTitle: true,
      kontekst,
    };
  },
});

function AnnenPersonRoute() {
  const { kontekst } = Route.useRouteContext();

  if (!kontekst) return null;

  return <AnnenPersonPage kontekst={kontekst} />;
}
