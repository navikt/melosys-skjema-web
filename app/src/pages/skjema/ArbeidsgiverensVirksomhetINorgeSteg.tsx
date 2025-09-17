import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

const stepKey = "arbeidsgiverens-virksomhet-i-norge";

export function ArbeidsgiverensVirksomhetINorgeSteg() {
  return (
    <SkjemaSteg
      config={{
        stepKey,
      }}
    />
  );
}
