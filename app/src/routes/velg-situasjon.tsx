import { createFileRoute, redirect } from "@tanstack/react-router";

import { erToggleAktiv } from "~/featuretoggle/erToggleAktiv.ts";
import { VELG_SITUASJON } from "~/featuretoggle/toggleNavn.ts";
import { VelgSituasjonPage } from "~/pages/velgSituasjon/VelgSituasjonPage.tsx";

export const Route = createFileRoute("/velg-situasjon")({
  beforeLoad: async ({ context: { queryClient } }) => {
    if (!(await erToggleAktiv(queryClient, VELG_SITUASJON))) {
      throw redirect({ to: "/representasjon", replace: true });
    }
  },
  component: VelgSituasjonPage,
});
