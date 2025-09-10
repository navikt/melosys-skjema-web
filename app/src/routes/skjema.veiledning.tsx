import { createFileRoute } from "@tanstack/react-router";

import { VeiledningSteg } from "~/pages/skjema/VeiledningSteg";

export const Route = createFileRoute("/skjema/veiledning")({
  component: VeiledningSteg,
});
