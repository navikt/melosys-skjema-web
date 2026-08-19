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
  const isErInnsendt = !!matchRoute({ to: "/skjema/$id/innsendt" });

  if (skjemaId && !isErInnsendt) {
    return <SkjemaParterHeader skjemaId={skjemaId} />;
  }

  return (
    <HStack align="center" justify="space-between">
      <Heading level="1" size="medium">
        {t("appHeader.tittel")}
      </Heading>
      {representasjonskontekst ? <KontekstVelger /> : <MaalformVelger />}
    </HStack>
  );
}
