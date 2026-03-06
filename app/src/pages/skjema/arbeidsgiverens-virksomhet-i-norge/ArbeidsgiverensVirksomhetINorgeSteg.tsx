import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { VirksomhetINorgeStegContent } from "~/pages/skjema/arbeidsgiverens-virksomhet-i-norge/VirksomhetINorgeStegContent.tsx";
import { Skjemadel } from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getArbeidsgiverensVirksomhetINorge } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";

export function ArbeidsgiverensVirksomhetINorgeSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader
      allowedSkjemadeler={[
        Skjemadel.ARBEIDSGIVERS_DEL,
        Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
      ]}
      id={id}
      skjemaQuery={getSkjemaQuery}
    >
      {(skjema) => {
        const { skjemadel } = skjema.metadata;
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
