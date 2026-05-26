import { Heading, HStack } from "@navikt/ds-react";
import { useMatchRoute, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { KontekstVelger } from "~/components/KontekstVelger.tsx";
import { MaalformVelger } from "~/components/MaalformVelger.tsx";
import { SkjemaParterHeader } from "~/components/SkjemaParterHeader.tsx";
import { useRepresentasjonskontekst } from "~/hooks/useRepresentasjonskontekst.ts";

export function AppHeader() {
  const { t } = useTranslation();
  const representasjonskontekst = useRepresentasjonskontekst();
  const { id: skjemaId } = useParams({ strict: false });
  const matchRoute = useMatchRoute();
  const erInnsendt = !!matchRoute({ to: "/skjema/$id/innsendt" });

  if (skjemaId && !erInnsendt) {
    return <SkjemaParterHeader skjemaId={skjemaId} />;
  }

  // Fjern paddingBlock i MELOSYS-8094
  return (
    <HStack align="center" justify="space-between" paddingBlock="space-8">
      <Heading level="1" size="medium">
        {t("appHeader.tittel")}
      </Heading>
      {representasjonskontekst ? <KontekstVelger /> : <MaalformVelger />}
    </HStack>
  );
}
