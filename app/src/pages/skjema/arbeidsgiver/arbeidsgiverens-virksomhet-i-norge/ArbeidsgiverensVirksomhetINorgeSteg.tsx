import { VirksomhetINorgeStegContent } from "~/pages/skjema/arbeidsgiver/arbeidsgiverens-virksomhet-i-norge/VirksomhetINorgeStegContent.tsx";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ArbeidsgiverSkjemaProps } from "../types.ts";

export const stepKey = "arbeidsgiverens-virksomhet-i-norge";

function ArbeidsgiverensVirksomhetINorgeStegContent({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  return <VirksomhetINorgeStegContent skjema={skjema} />;
}

interface ArbeidsgiverensVirksomhetINorgeStegProps {
  id: string;
}

export function ArbeidsgiverensVirksomhetINorgeSteg({
  id,
}: ArbeidsgiverensVirksomhetINorgeStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => (
        <ArbeidsgiverensVirksomhetINorgeStegContent skjema={skjema} />
      )}
    </ArbeidsgiverStegLoader>
  );
}
