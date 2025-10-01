import { PaperplaneIcon } from "@navikt/aksel-icons";
import { useTranslation } from "react-i18next";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "oppsummering";

export function OppsummeringSteg() {
  const { t } = useTranslation();

  return (
    <SkjemaSteg
      config={{
        stepKey,
        stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
        customNesteKnapp: {
          tekst: t("felles.sendSoknad"),
          ikon: <PaperplaneIcon />,
          type: "submit",
        },
      }}
    />
  );
}
