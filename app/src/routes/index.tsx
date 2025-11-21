import { createFileRoute, redirect } from "@tanstack/react-router";

import { LandingssidePage } from "~/pages/landingsside/LandingssidePage";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/")({
  component: LandingssideRoute,
  beforeLoad: () => {
    const eksisterendeKontekst = getRepresentasjonKontekst();

    // Hvis kontekst finnes, redirecter til riktig side (LandingssidePage rendres aldri i dette tilfellet)
    // Hvis ingen kontekst, vis landingssiden slik at bruker kan velge representasjonstype
    if (eksisterendeKontekst) {
      // Naviger basert på konteksttype og om den er komplett
      if (
        eksisterendeKontekst.type === "RADGIVER" &&
        !eksisterendeKontekst.radgiverfirma
      ) {
        throw redirect({ to: "/representasjon/radgiverfirma" });
      }

      if (
        eksisterendeKontekst.type === "ANNEN_PERSON" &&
        !eksisterendeKontekst.arbeidstaker
      ) {
        throw redirect({ to: "/representasjon/annen-person" });
      }

      throw redirect({ to: "/oversikt" });
    }

    return {
      hideSiteTitle: true,
    };
  },
});

function LandingssideRoute() {
  return <LandingssidePage />;
}
