import { createFileRoute, Outlet } from "@tanstack/react-router";

import { setRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/annen-person")({
  component: RouteComponent,
  beforeLoad: () => {
    setRepresentasjonKontekst({
      representasjonstype: "ANNEN_PERSON",
      harFullmakt: false,
    });
  },
});

function RouteComponent() {
  return <Outlet />;
}
