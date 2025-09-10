import { PaperplaneIcon } from "@navikt/aksel-icons";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

export function OppsummeringSteg() {
  return (
    <SkjemaSteg
      config={{
        stegNummer: 8,
        tittel: "Oppsummering",
        forrigeRoute: "../du-som-fyller-ut-skjemaet",
        nesteRoute: "#",
        customNesteKnapp: {
          tekst: "Send søknad",
          ikon: <PaperplaneIcon />,
          type: "submit",
        },
      }}
    />
  );
}
