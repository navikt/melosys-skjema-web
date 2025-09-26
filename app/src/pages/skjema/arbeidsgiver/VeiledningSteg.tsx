import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

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
