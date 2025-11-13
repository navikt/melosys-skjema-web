import { useInvalidateArbeidstakersSkjemaQuery } from "~/hooks/useInvalidateArbeidstakersSkjemaQuery.ts";
import { postTilleggsopplysninger } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { TilleggsopplysningerStegContent } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegContent.tsx";

import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";

export { stepKey } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegContent.tsx";

interface TilleggsopplysningerStegProps {
  id: string;
}

export function TilleggsopplysningerSteg({
  id,
}: TilleggsopplysningerStegProps) {
  const invalidateArbeidstakersSkjemaQuery =
    useInvalidateArbeidstakersSkjemaQuery();
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => (
        <TilleggsopplysningerStegContent
          invalidateSkjemaQuery={invalidateArbeidstakersSkjemaQuery}
          postTilleggsopplysninger={postTilleggsopplysninger}
          skjema={skjema}
          stegRekkefolge={ARBEIDSTAKER_STEG_REKKEFOLGE}
        />
      )}
    </ArbeidstakerStegLoader>
  );
}
