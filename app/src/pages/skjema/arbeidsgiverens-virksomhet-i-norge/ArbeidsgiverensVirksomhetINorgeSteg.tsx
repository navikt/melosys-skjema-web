import { VirksomhetINorgeStegContent } from "~/pages/skjema/arbeidsgiverens-virksomhet-i-norge/VirksomhetINorgeStegContent.tsx";

import { ArbeidsgiverSkjemaProps } from "../types.ts";
import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";

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
