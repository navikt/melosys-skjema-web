import { createFileRoute } from "@tanstack/react-router";

import { ArbeidsgiverOppsummeringSteg } from "~/pages/skjema/arbeidsgiver/oppsummering/ArbeidsgiverOppsummeringSteg.tsx";
import { ArbeidstakerOppsummeringSteg } from "~/pages/skjema/arbeidstaker/oppsummering/ArbeidstakerOppsummeringSteg.tsx";

import type { SkjemaType } from "./skjema.$id.tsx";

function OppsummeringStegRoute() {
  const { id } = Route.useParams();
  const { skjemaType } = Route.useRouteContext() as { skjemaType: SkjemaType };

  return skjemaType === "arbeidsgiver" ? (
    <ArbeidsgiverOppsummeringSteg id={id} />
  ) : (
    <ArbeidstakerOppsummeringSteg id={id} />
  );
}

export const Route = createFileRoute("/skjema/$id/oppsummering")({
  component: OppsummeringStegRoute,
});
