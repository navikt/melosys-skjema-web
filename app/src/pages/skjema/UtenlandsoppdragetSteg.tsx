import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

export function UtenlandsoppdragetSteg() {
  return (
    <SkjemaSteg
      config={{
        stegNummer: 5,
        tittel: "Utenlandsoppdraget",
        forrigeRoute: "../arbeidsgiverens-virksomhet-i-norge",
        nesteRoute: "../arbeidstakerens-lonn",
      }}
    />
  );
}
