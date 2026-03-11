import { createFileRoute } from "@tanstack/react-router";

import { VelgRadgiverfirmaPage } from "~/pages/representasjon/velg-radgiverfirma/VelgRadgiverfirmaPage.tsx";

export const Route = createFileRoute("/representasjon/velg-radgiverfirma")({
  component: VelgRadgiverfirmaPage,
});
