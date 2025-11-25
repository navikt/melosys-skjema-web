import { createFileRoute, Outlet } from "@tanstack/react-router";

import { setRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/arbeidsgiver-som-radgiver")({
  component: RouteComponent,
  beforeLoad: () => {
    setRepresentasjonKontekst({
      representasjonstype: "RADGIVER",
      harFullmakt: false,
    });
  },
});

function RouteComponent() {
  return <Outlet />;
}
