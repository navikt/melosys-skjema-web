import { createFileRoute, redirect } from "@tanstack/react-router";

import { DegSelvPage } from "~/pages/representasjon/deg-selv/DegSelvPage";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/deg-selv/")({
  component: DegSelvRoute,
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

function DegSelvRoute() {
  const { kontekst } = Route.useRouteContext();

  if (!kontekst) return null;

  return <DegSelvPage kontekst={kontekst} />;
}
