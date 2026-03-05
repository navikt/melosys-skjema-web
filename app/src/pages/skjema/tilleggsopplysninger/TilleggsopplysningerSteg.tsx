import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { postTilleggsopplysninger } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { TilleggsopplysningerStegContent } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegContent.tsx";
import type { TilleggsopplysningerDto } from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import type { SkjemaData } from "../types.ts";

export { stepKey } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegContent.tsx";

// tilleggsopplysninger lives on the base type, so all 3 variants have it
function getTilleggsopplysninger(
  data?: SkjemaData,
): TilleggsopplysningerDto | undefined {
  if (!data) return undefined;
  return data.tilleggsopplysninger;
}

export function TilleggsopplysningerSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => (
        <TilleggsopplysningerStegContent
          postTilleggsopplysninger={postTilleggsopplysninger}
          skjemaId={skjema.id}
          stegData={getTilleggsopplysninger(skjema.data)}
          stegRekkefolge={STEG_REKKEFOLGE[skjema.metadata.skjemadel]}
        />
      )}
    </SkjemaStegLoader>
  );
}
