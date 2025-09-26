import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "veiledning";

export function VeiledningSteg() {
  return (
    <SkjemaSteg
      config={{
        stepKey,
        stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
      }}
    />
  );
}
