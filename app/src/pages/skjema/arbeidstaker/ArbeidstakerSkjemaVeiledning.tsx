import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import { SkjemaVeiledning } from "~/pages/skjema/components/SkjemaVeiledning.tsx";

export function ArbeidstakerSkjemaVeiledning() {
  return (
    <SkjemaVeiledning startRoute={ARBEIDSTAKER_STEG_REKKEFOLGE[0]?.route} />
  );
}
