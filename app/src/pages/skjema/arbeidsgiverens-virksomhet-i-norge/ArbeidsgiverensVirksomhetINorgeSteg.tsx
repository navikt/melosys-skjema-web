import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { VirksomhetINorgeStegContent } from "~/pages/skjema/arbeidsgiverens-virksomhet-i-norge/VirksomhetINorgeStegContent.tsx";
import type { ArbeidsgiverensVirksomhetINorgeDto } from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import {
  isArbeidsgiverData,
  isCombinedData,
  type SkjemaData,
} from "../types.ts";

export const stepKey = "arbeidsgiverens-virksomhet-i-norge";

function getArbeidsgiverensVirksomhetINorge(
  data?: SkjemaData,
): ArbeidsgiverensVirksomhetINorgeDto | undefined {
  if (!data) return undefined;
  if (isArbeidsgiverData(data)) return data.arbeidsgiverensVirksomhetINorge;
  if (isCombinedData(data))
    return data.arbeidsgiversData?.arbeidsgiverensVirksomhetINorge;
  return undefined;
}

export function ArbeidsgiverensVirksomhetINorgeSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => (
        <VirksomhetINorgeStegContent
          skjemaId={skjema.id}
          stegData={getArbeidsgiverensVirksomhetINorge(skjema.data)}
          stegRekkefolge={STEG_REKKEFOLGE[skjema.metadata.skjemadel]}
        />
      )}
    </SkjemaStegLoader>
  );
}
