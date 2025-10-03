import { createFileRoute } from "@tanstack/react-router";

import { FamiliemedlemmerSteg } from "~/pages/skjema/arbeidstaker/FamiliemedlemmerSteg.tsx";

export const Route = createFileRoute("/skjema/arbeidstaker/familiemedlemmer")({
  component: FamiliemedlemmerSteg,
});