import { createFileRoute, redirect } from "@tanstack/react-router";

import { DinArbeidsgiverPage } from "~/pages/representasjon/din-arbeidsgiver/DinArbeidsgiverPage";
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

  return <DinArbeidsgiverPage kontekst={kontekst} />;
}
