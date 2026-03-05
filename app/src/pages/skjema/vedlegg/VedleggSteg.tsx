import { VedleggStegContent } from "~/pages/skjema/components/vedlegg/VedleggStegContent.tsx";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import {
  ARBEIDSGIVER_STEG_REKKEFOLGE,
  ARBEIDSTAKER_STEG_REKKEFOLGE,
} from "../stegRekkefølge.ts";

export { stepKey } from "~/pages/skjema/components/vedlegg/VedleggStegContent.tsx";

interface VedleggStegProps {
  id: string;
  skjemaType: "arbeidsgiver" | "arbeidstaker";
}

export function VedleggSteg({ id, skjemaType }: VedleggStegProps) {
  const stegRekkefolge =
    skjemaType === "arbeidsgiver"
      ? ARBEIDSGIVER_STEG_REKKEFOLGE
      : ARBEIDSTAKER_STEG_REKKEFOLGE;

  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => (
        <VedleggStegContent skjema={skjema} stegRekkefolge={stegRekkefolge} />
      )}
    </ArbeidsgiverStegLoader>
  );
}
