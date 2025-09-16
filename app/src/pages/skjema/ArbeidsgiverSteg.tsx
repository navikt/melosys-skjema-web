import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

export function ArbeidsgiverSteg() {
  return (
    <SkjemaSteg
      config={{
        stegNummer: 2,
        tittel: "Arbeidsgiveren",
        forrigeRoute: "../veiledning",
        nesteRoute: "../arbeidstakeren",
      }}
    />
  );
}
