import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidsgiver/stegRekkefølge.ts";
import { SkjemaVeiledning } from "~/pages/skjema/components/SkjemaVeiledning.tsx";

export function ArbeidsgiverSkjemaVeiledning() {
  return (
    <SkjemaVeiledning startRoute={ARBEIDSGIVER_STEG_REKKEFOLGE[0]?.route} />
  );
}
