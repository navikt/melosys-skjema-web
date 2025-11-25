import { createFileRoute, redirect } from "@tanstack/react-router";

import { OversiktPage } from "~/pages/representasjon/OversiktPage";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute(
  "/representasjon/arbeidsgiver-som-radgiver/",
)({
  component: ArbeidsgiverSomRadgiverRoute,
  beforeLoad: () => {
    const kontekst = getRepresentasjonKontekst();

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

function ArbeidsgiverSomRadgiverRoute() {
  const { kontekst } = Route.useRouteContext();

  if (!kontekst) return null;

  return <OversiktPage kontekst={kontekst} />;
}
