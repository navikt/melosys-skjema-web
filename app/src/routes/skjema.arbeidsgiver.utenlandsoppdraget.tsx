import { createFileRoute } from "@tanstack/react-router";

import { UtenlandsoppdragetSteg } from "~/pages/skjema/arbeidsgiver/UtenlandsoppdragetSteg.tsx";

export const Route = createFileRoute("/skjema/arbeidsgiver/utenlandsoppdraget")(
  {
    component: UtenlandsoppdragetSteg,
  },
);
