import { createFileRoute } from "@tanstack/react-router";

import { Skjema } from "~/pages/skjema/Skjema";

export const Route = createFileRoute("/skjema/")({
  component: Skjema,
});
