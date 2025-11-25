import { createFileRoute, Outlet } from "@tanstack/react-router";

import { setRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/deg-selv")({
  component: RouteComponent,
  beforeLoad: () => {
    setRepresentasjonKontekst({
      representasjonstype: "DEG_SELV",
      harFullmakt: false,
    });
  },
});

function RouteComponent() {
  return <Outlet />;
}
