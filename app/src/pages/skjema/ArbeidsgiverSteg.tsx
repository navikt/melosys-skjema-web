import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

export function ArbeidsgiverSteg() {
  return (
    <SkjemaSteg
      config={{
        stegNummer: 3,
        tittel: "Arbeidsgiveren",
        forrigeRoute: "../arbeidstakeren",
        nesteRoute: "../arbeidsgiverens-virksomhet-i-norge",
      }}
    />
  );
}
