import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { postTilleggsopplysninger } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { TilleggsopplysningerStegContent } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegContent.tsx";

import {
  ARBEIDSGIVER_STEG_REKKEFOLGE,
  ARBEIDSTAKER_STEG_REKKEFOLGE,
} from "../stegRekkefølge.ts";
import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";

export { stepKey } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegContent.tsx";

interface TilleggsopplysningerStegProps {
  id: string;
  skjemaType: "arbeidsgiver" | "arbeidstaker";
}

export function TilleggsopplysningerSteg({
  id,
  skjemaType,
}: TilleggsopplysningerStegProps) {
  const invalidateSkjemaQuery = useInvalidateSkjemaQuery();
  const stegRekkefolge =
    skjemaType === "arbeidsgiver"
      ? ARBEIDSGIVER_STEG_REKKEFOLGE
      : ARBEIDSTAKER_STEG_REKKEFOLGE;

  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => (
        <TilleggsopplysningerStegContent
          invalidateSkjemaQuery={invalidateSkjemaQuery}
          postTilleggsopplysninger={postTilleggsopplysninger}
          skjema={skjema}
          stegRekkefolge={stegRekkefolge}
        />
      )}
    </ArbeidsgiverStegLoader>
  );
}
