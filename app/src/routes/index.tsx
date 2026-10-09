import { createFileRoute, redirect } from "@tanstack/react-router";

import { erToggleAktiv } from "~/featuretoggle/erToggleAktiv.ts";
import { VELG_SITUASJON } from "~/featuretoggle/toggleNavn.ts";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context: { queryClient } }) => {
    if (await erToggleAktiv(queryClient, VELG_SITUASJON)) {
      throw redirect({ to: "/velg-situasjon" });
    }
    throw redirect({ to: "/representasjon" });
  },
});
