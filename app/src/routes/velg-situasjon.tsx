import { createFileRoute } from "@tanstack/react-router";

import { VelgSituasjonPage } from "~/pages/velgSituasjon/VelgSituasjonPage.tsx";

export const Route = createFileRoute("/velg-situasjon")({
  component: VelgSituasjonPage,
});
