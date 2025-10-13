import { createFileRoute } from "@tanstack/react-router";

import { SkatteforholdOgInntektSteg } from "~/pages/skjema/arbeidstaker/SkatteforholdOgInntektSteg.tsx";

function SkatteforholdOgInntektStegRoute() {
  const { id } = Route.useParams();
  return <SkatteforholdOgInntektSteg id={id} />;
}

export const Route = createFileRoute("/skjema/arbeidstaker/$id/skatteforhold-og-inntekt")({
  component: SkatteforholdOgInntektStegRoute,
});
