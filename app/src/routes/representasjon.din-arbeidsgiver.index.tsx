import { createFileRoute, redirect } from "@tanstack/react-router";

import { OversiktPage } from "~/pages/representasjon/OversiktPage";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/din-arbeidsgiver/")({
  component: DinArbeidsgiverRoute,
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

function DinArbeidsgiverRoute() {
  const { kontekst } = Route.useRouteContext();

  if (!kontekst) return null;

  return <OversiktPage kontekst={kontekst} />;
}
