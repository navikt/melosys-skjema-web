import { createFileRoute } from "@tanstack/react-router";

import { SkjemaStart } from "~/pages/skjema/SkjemaStart.tsx";

export const Route = createFileRoute("/skjema/start")({
  component: SkjemaStart,
});
