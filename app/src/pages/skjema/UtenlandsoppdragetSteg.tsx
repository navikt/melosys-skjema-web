import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

const stepKey = "utenlandsoppdraget";

export function UtenlandsoppdragetSteg() {
  return (
    <SkjemaSteg
      config={{
        stepKey,
      }}
    />
  );
}
