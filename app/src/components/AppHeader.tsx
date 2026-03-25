import { Heading, HStack } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { KontekstVelger } from "~/components/KontekstVelger.tsx";
import { MaalformVelger } from "~/components/MaalformVelger.tsx";
import { useRepresentasjonskontekst } from "~/hooks/useRepresentasjonskontekst.ts";

export function AppHeader() {
  const { t } = useTranslation();
  const representasjonskontekst = useRepresentasjonskontekst();

  return (
    <HStack align="center" justify="space-between">
      <Heading level="1" size="medium">
        {t("appHeader.tittel")}
      </Heading>
      {representasjonskontekst ? <KontekstVelger /> : <MaalformVelger />}
    </HStack>
  );
}
