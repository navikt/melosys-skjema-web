import { createFileRoute, Outlet } from "@tanstack/react-router";

import { setRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/din-arbeidsgiver")({
  component: RouteComponent,
  beforeLoad: () => {
    setRepresentasjonKontekst({
      representasjonstype: "ARBEIDSGIVER",
      harFullmakt: false,
    });
  },
});

function RouteComponent() {
  return <Outlet />;
}
