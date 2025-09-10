import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

export function VeiledningSteg() {
  return (
    <SkjemaSteg
      config={{
        stegNummer: 1,
        tittel: "Veiledning",
        nesteRoute: "../arbeidstakeren",
      }}
    />
  );
}
