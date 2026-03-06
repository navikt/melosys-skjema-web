import { ErrorMessage } from "@navikt/ds-react";

import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { VirksomhetINorgeStegContent } from "~/pages/skjema/arbeidsgiverens-virksomhet-i-norge/VirksomhetINorgeStegContent.tsx";
import { Skjemadel } from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getArbeidsgiverensVirksomhetINorge } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";

export function ArbeidsgiverensVirksomhetINorgeSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => {
        const { skjemadel } = skjema.metadata;
        if (
          skjemadel !== Skjemadel.ARBEIDSGIVERS_DEL &&
          skjemadel !== Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL
        ) {
          return (
            <ErrorMessage>
              Steget er ikke tilgjengelig for denne skjemadelen
            </ErrorMessage>
          );
        }
        return (
          <VirksomhetINorgeStegContent
            skjemaId={skjema.id}
            stegData={getArbeidsgiverensVirksomhetINorge(skjema)}
            stegRekkefolge={STEG_REKKEFOLGE[skjemadel]}
          />
        );
      }}
    </SkjemaStegLoader>
  );
}
