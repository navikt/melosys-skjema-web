import { useNavigate } from "@tanstack/react-router";

import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import { SkjemaVeiledning } from "~/pages/skjema/components/SkjemaVeiledning.tsx";

export function ArbeidstakerSkjemaVeiledning() {
  const navigate = useNavigate();
  const startRoute = ARBEIDSTAKER_STEG_REKKEFOLGE[0]?.route;

  return (
    <SkjemaVeiledning onStartSoknad={() => navigate({ to: startRoute })} />
  );
}
