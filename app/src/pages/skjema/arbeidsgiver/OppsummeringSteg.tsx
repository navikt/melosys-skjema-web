import { PaperplaneIcon } from "@navikt/aksel-icons";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

const stepKey = "oppsummering";

export function OppsummeringSteg() {
  return (
    <SkjemaSteg
      config={{
        stepKey,
        customNesteKnapp: {
          tekst: "Send søknad",
          ikon: <PaperplaneIcon />,
          type: "submit",
        },
      }}
    />
  );
}
