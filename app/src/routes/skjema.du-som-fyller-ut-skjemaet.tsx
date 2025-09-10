import { createFileRoute } from "@tanstack/react-router";

import { DuSomFyllerUtSkjemaetSteg } from "~/pages/skjema/DuSomFyllerUtSkjemaetSteg";

export const Route = createFileRoute("/skjema/du-som-fyller-ut-skjemaet")({
  component: DuSomFyllerUtSkjemaetSteg,
});
