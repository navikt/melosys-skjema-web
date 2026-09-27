import { Heading, HStack } from "@navikt/ds-react";
import { useMatchRoute, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { KontekstVelger } from "~/components/KontekstVelger.tsx";
import { MaalformVelger } from "~/components/MaalformVelger.tsx";
import {
  SkjemaParter,
  SkjemaParterHeader,
} from "~/components/SkjemaParterHeader.tsx";
import { useRepresentasjonskontekst } from "~/hooks/useRepresentasjonskontekst.ts";
import { useNySoknadFraHistorikk } from "~/pages/skjema/nySoknad.ts";

export function AppHeader() {
  const { t } = useTranslation();
  const representasjonskontekst = useRepresentasjonskontekst();
  const { id: skjemaId } = useParams({ strict: false });
  const matchRoute = useMatchRoute();
  const erInnsendt = !!matchRoute({ to: "/skjema/$id/innsendt" });
  const nySoknad = useNySoknadFraHistorikk();

  if (skjemaId && !erInnsendt) {
    return <SkjemaParterHeader skjemaId={skjemaId} />;
  }

  const erSkjemaStart = !!matchRoute({ to: "/skjema/start" });

  // Introsiden: utkastet finnes ikke ennå, så partene hentes fra history state.
  return erSkjemaStart && nySoknad ? (
    <SkjemaParter
      arbeidsgiver={nySoknad.arbeidsgiver}
      arbeidstaker={{
        navn: nySoknad.arbeidstaker.etternavn ?? "",
        fnr: nySoknad.arbeidstaker.fnr,
      }}
      representasjonstype={nySoknad.representasjonstype}
    />
  ) : (
    <HStack align="center" justify="space-between">
      <Heading level="1" size="medium">
        {t("appHeader.tittel")}
      </Heading>
      {representasjonskontekst ? <KontekstVelger /> : <MaalformVelger />}
    </HStack>
  );
}
