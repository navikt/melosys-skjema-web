import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

const stepKey = "veiledning";

export function VeiledningSteg() {
  return (
    <SkjemaSteg
      config={{
        stepKey,
      }}
    />
  );
}
