import { useInvalidateArbeidsgiversSkjemaQuery } from "~/hooks/useInvalidateArbeidsgiversSkjemaQuery.ts";
import { postTilleggsopplysningerArbeidsgiver } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { TilleggsopplysningerStegContent } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegContent.tsx";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";

export { stepKey } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegContent.tsx";

interface TilleggsopplysningerStegProps {
  id: string;
}

export function TilleggsopplysningerSteg({
  id,
}: TilleggsopplysningerStegProps) {
  const invalidateArbeidsgiversSkjemaQuery =
    useInvalidateArbeidsgiversSkjemaQuery();
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => (
        <TilleggsopplysningerStegContent
          invalidateSkjemaQuery={invalidateArbeidsgiversSkjemaQuery}
          postTilleggsopplysninger={postTilleggsopplysningerArbeidsgiver}
          skjema={skjema}
          stegRekkefolge={ARBEIDSGIVER_STEG_REKKEFOLGE}
        />
      )}
    </ArbeidsgiverStegLoader>
  );
}
