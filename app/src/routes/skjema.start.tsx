import { createFileRoute } from "@tanstack/react-router";

import { SkjemaStart } from "~/pages/skjema/SkjemaStart.tsx";
import { representasjonskontekstSchema } from "~/types/representasjon.ts";

export const Route = createFileRoute("/skjema/start")({
  validateSearch: (search) =>
    representasjonskontekstSchema.partial().parse(search),
  component: SkjemaStart,
});
