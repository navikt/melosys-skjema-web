import { createFileRoute } from "@tanstack/react-router";

import { VeiledningSteg } from "~/pages/skjema/arbeidsgiver/VeiledningSteg.tsx";

export const Route = createFileRoute("/skjema/arbeidsgiver/veiledning")({
  component: VeiledningSteg,
});
