import { createFileRoute } from "@tanstack/react-router";

import { SkatteforholdOgInntektSteg } from "~/pages/skjema/arbeidstaker/SkatteforholdOgInntektSteg.tsx";

export const Route = createFileRoute(
  "/skjema/arbeidstaker/skatteforhold-og-inntekt",
)({
  component: SkatteforholdOgInntektSteg,
});
