import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

const stepKey = "arbeidstakerens-lonn";

export function ArbeidstakerensLonnSteg() {
  return (
    <SkjemaSteg
      config={{
        stepKey,
      }}
    />
  );
}
