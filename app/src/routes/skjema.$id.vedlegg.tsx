import { createFileRoute } from "@tanstack/react-router";

import { VedleggSteg as ArbeidsgiverVedleggSteg } from "~/pages/skjema/arbeidsgiver/vedlegg/VedleggSteg.tsx";
import { VedleggSteg as ArbeidstakerVedleggSteg } from "~/pages/skjema/arbeidstaker/vedlegg/VedleggSteg.tsx";

import type { SkjemaType } from "./skjema.$id.tsx";

function VedleggStegRoute() {
  const { id } = Route.useParams();
  const { skjemaType } = Route.useRouteContext() as { skjemaType: SkjemaType };

  return skjemaType === "arbeidsgiver" ? (
    <ArbeidsgiverVedleggSteg id={id} />
  ) : (
    <ArbeidstakerVedleggSteg id={id} />
  );
}

export const Route = createFileRoute("/skjema/$id/vedlegg")({
  component: VedleggStegRoute,
});
