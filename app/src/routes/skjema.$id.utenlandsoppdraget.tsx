import { createFileRoute } from "@tanstack/react-router";

import { UtenlandsoppdragetSteg as ArbeidsgiverUtenlandsoppdragetSteg } from "~/pages/skjema/arbeidsgiver/utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";
import { UtenlandsoppdragetSteg as ArbeidstakerUtenlandsoppdragetSteg } from "~/pages/skjema/arbeidstaker/utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";

import type { SkjemaType } from "./skjema.$id.tsx";

function UtenlandsoppdragetStegRoute() {
  const { id } = Route.useParams();
  const { skjemaType } = Route.useRouteContext() as { skjemaType: SkjemaType };

  return skjemaType === "arbeidsgiver" ? (
    <ArbeidsgiverUtenlandsoppdragetSteg id={id} />
  ) : (
    <ArbeidstakerUtenlandsoppdragetSteg id={id} />
  );
}

export const Route = createFileRoute("/skjema/$id/utenlandsoppdraget")({
  component: UtenlandsoppdragetStegRoute,
});
