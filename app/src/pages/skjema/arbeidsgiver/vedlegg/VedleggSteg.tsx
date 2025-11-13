import { VedleggStegContent } from "~/pages/skjema/components/vedlegg/VedleggStegContent.tsx";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";

export { stepKey } from "~/pages/skjema/components/vedlegg/VedleggStegContent.tsx";

interface VedleggStegProps {
  id: string;
}

export function VedleggSteg({ id }: VedleggStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => (
        <VedleggStegContent
          skjema={skjema}
          stegRekkefolge={ARBEIDSGIVER_STEG_REKKEFOLGE}
        />
      )}
    </ArbeidsgiverStegLoader>
  );
}
