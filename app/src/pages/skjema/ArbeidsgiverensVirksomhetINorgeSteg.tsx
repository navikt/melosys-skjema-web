import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

export function ArbeidsgiverensVirksomhetINorgeSteg() {
  return (
    <SkjemaSteg
      config={{
        stegNummer: 4,
        tittel: "Arbeidsgiverens virksomhet i Norge",
        forrigeRoute: "../arbeidstakeren",
        nesteRoute: "../utenlandsoppdraget",
      }}
    />
  );
}
