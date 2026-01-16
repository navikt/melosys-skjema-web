import { Heading, HStack } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { KontekstVelger } from "~/components/KontekstVelger.tsx";
import { MaalformVelger } from "~/components/MaalformVelger.tsx";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage.ts";

export function AppHeader() {
  const { t } = useTranslation();
  const kontekst = getRepresentasjonKontekst();

  return (
    <HStack align="center" justify="space-between">
      <Heading level="1" size="medium">
        {t("appHeader.tittel")}
      </Heading>
      {kontekst ? <KontekstVelger /> : <MaalformVelger />}
    </HStack>
  );
}
