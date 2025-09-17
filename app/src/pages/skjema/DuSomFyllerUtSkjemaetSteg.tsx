import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

const stepKey = "du-som-fyller-ut-skjemaet";

export function DuSomFyllerUtSkjemaetSteg() {
  return (
    <SkjemaSteg
      config={{
        stepKey,
      }}
    />
  );
}
