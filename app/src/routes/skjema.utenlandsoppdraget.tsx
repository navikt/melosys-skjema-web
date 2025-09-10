import { createFileRoute } from "@tanstack/react-router";

import { UtenlandsoppdragetSteg } from "~/pages/skjema/UtenlandsoppdragetSteg";

export const Route = createFileRoute("/skjema/utenlandsoppdraget")({
  component: UtenlandsoppdragetSteg,
});
