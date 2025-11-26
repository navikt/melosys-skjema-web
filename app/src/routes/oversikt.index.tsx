import { createFileRoute, redirect } from "@tanstack/react-router";

import { OversiktPage } from "~/pages/oversikt/OversiktPage.tsx";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/oversikt/")({
  component: OversiktRoute,
  beforeLoad: () => {
    const kontekst = getRepresentasjonKontekst();

    // Redirect til landingsside hvis ingen kontekst er valgt
    if (!kontekst) {
      throw redirect({ to: "/" });
    }

    // Redirect til velg rådgiverfirma hvis RADGIVER men ingen firma valgt
    if (
      kontekst.representasjonstype === "RADGIVER" &&
      !kontekst.radgiverfirma
    ) {
      throw redirect({ to: "/representasjon/velg-radgiverfirma" });
    }

    return {
      hideSiteTitle: true,
      kontekst,
    };
  },
});

function OversiktRoute() {
  const { kontekst } = Route.useRouteContext();

  return <OversiktPage kontekst={kontekst} />;
}
