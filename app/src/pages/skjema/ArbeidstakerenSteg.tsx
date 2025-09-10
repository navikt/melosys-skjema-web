import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

export function ArbeidstakerenSteg() {
  return (
    <SkjemaSteg
      config={{
        stegNummer: 2,
        tittel: "Arbeidstakeren",
        forrigeRoute: "../veiledning",
        nesteRoute: "../arbeidsgiveren",
      }}
    />
  );
}
