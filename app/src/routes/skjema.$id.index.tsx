import { createFileRoute, redirect } from "@tanstack/react-router";

import type { SkjemaType } from "./skjema.$id.tsx";

export const Route = createFileRoute("/skjema/$id/")({
  beforeLoad: ({ params, context }) => {
    const { skjemaType } = context as { skjemaType: SkjemaType };
    const { id } = params;

    if (skjemaType === "arbeidsgiver") {
      throw redirect({
        to: "/skjema/$id/arbeidsgiverens-virksomhet-i-norge",
        params: { id },
      });
    }

    throw redirect({
      to: "/skjema/$id/utenlandsoppdraget",
      params: { id },
    });
  },
});
