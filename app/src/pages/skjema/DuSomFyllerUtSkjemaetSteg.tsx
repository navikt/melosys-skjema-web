import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

export function DuSomFyllerUtSkjemaetSteg() {
  return (
    <SkjemaSteg
      config={{
        stegNummer: 7,
        tittel: "Du som fyller ut skjemaet",
        forrigeRoute: "../arbeidstakerens-lonn",
        nesteRoute: "../oppsummering",
      }}
    />
  );
}
