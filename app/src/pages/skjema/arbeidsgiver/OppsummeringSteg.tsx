import { PaperplaneIcon } from "@navikt/aksel-icons";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "oppsummering";

export function OppsummeringSteg() {
  return (
    <SkjemaSteg
      config={{
        stepKey,
        stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
        customNesteKnapp: {
          tekst: "Send søknad",
          ikon: <PaperplaneIcon />,
          type: "submit",
        },
      }}
    />
  );
}
