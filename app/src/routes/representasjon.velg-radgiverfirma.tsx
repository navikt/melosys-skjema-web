import { createFileRoute, redirect } from "@tanstack/react-router";

import { VelgRadgiverfirmaPage } from "~/pages/representasjon/velg-radgiverfirma/VelgRadgiverfirmaPage.tsx";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/velg-radgiverfirma")({
  component: VelgRadgiverfirmaPage,
  beforeLoad: () => {
    const kontekst = getRepresentasjonKontekst();

    if (
      !kontekst ||
      kontekst.representasjonstype !== Representasjonstype.RADGIVER
    ) {
      throw redirect({ to: "/" });
    }

    return {
      kontekst,
    };
  },
});
