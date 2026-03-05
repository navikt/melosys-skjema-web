import { createFileRoute, redirect } from "@tanstack/react-router";

import { Skjemadel } from "~/types/melosysSkjemaTypes.ts";

export const Route = createFileRoute("/skjema/$id/")({
  beforeLoad: ({ params, context }) => {
    const { skjemadel } = context as { skjemadel: Skjemadel };
    const { id } = params;

    switch (skjemadel) {
      case Skjemadel.ARBEIDSGIVERS_DEL: {
        throw redirect({
          to: "/skjema/$id/arbeidsgiverens-virksomhet-i-norge",
          params: { id },
        });
      }
      case Skjemadel.ARBEIDSTAKERS_DEL: {
        throw redirect({
          to: "/skjema/$id/utenlandsoppdraget",
          params: { id },
        });
      }
      case Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL: {
        throw redirect({
          to: "/skjema/$id/utsendingsperiode-og-land",
          params: { id },
        });
      }
    }
  },
});
