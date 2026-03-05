import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { VedleggStegContent } from "~/pages/skjema/components/vedlegg/VedleggStegContent.tsx";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";

export { stepKey } from "~/pages/skjema/components/vedlegg/VedleggStegContent.tsx";

export function VedleggSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => (
        <VedleggStegContent
          skjemaId={skjema.id}
          stegRekkefolge={STEG_REKKEFOLGE[skjema.metadata.skjemadel]}
        />
      )}
    </SkjemaStegLoader>
  );
}
