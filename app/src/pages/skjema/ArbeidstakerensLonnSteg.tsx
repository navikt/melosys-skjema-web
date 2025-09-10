import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

export function ArbeidstakerensLonnSteg() {
  return (
    <SkjemaSteg
      config={{
        stegNummer: 6,
        tittel: "Arbeidstakerens lønn",
        forrigeRoute: "../utenlandsoppdraget",
        nesteRoute: "../du-som-fyller-ut-skjemaet",
      }}
    />
  );
}
