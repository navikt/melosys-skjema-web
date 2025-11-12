import { VedleggStegContent } from "~/pages/skjema/components/vedlegg/VedleggStegContent.tsx";

import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";

export { stepKey } from "~/pages/skjema/components/vedlegg/VedleggStegContent.tsx";

interface VedleggStegProps {
  id: string;
}

export function VedleggSteg({ id }: VedleggStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => (
        <VedleggStegContent
          skjema={skjema}
          stegRekkefolge={ARBEIDSTAKER_STEG_REKKEFOLGE}
        />
      )}
    </ArbeidstakerStegLoader>
  );
}
