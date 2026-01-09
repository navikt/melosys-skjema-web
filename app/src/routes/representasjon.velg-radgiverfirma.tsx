import { createFileRoute, redirect } from "@tanstack/react-router";

import { VelgRadgiverfirmaPage } from "~/pages/representasjon/velg-radgiverfirma/VelgRadgiverfirmaPage.tsx";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/velg-radgiverfirma")({
  component: VelgRadgiverfirmaPage,
  beforeLoad: () => {
    const kontekst = getRepresentasjonKontekst();

    if (!kontekst || kontekst.representasjonstype !== "RADGIVER") {
      throw redirect({ to: "/" });
    }

    return {
      kontekst,
    };
  },
});
