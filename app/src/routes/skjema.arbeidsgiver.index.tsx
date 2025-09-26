import { createFileRoute } from "@tanstack/react-router";

import { Skjema } from "~/pages/skjema/arbeidsgiver/Skjema.tsx";

export const Route = createFileRoute("/skjema/arbeidsgiver/")({
  component: Skjema,
});
