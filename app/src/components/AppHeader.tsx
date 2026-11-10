import { Heading, Stack } from "@navikt/ds-react";
import { useMatchRoute, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { KontekstVelger } from "~/components/KontekstVelger.tsx";
import { MaalformVelger } from "~/components/MaalformVelger.tsx";
import {
  SkjemaParter,
  SkjemaParterHeader,
} from "~/components/SkjemaParterHeader.tsx";
import { useRepresentasjonskontekst } from "~/hooks/useRepresentasjonskontekst.ts";
import { hentNySoknad } from "~/pages/skjema/nySoknad.ts";

export function AppHeader() {
  const { t } = useTranslation();
  const representasjonskontekst = useRepresentasjonskontekst();
  const { id: skjemaId } = useParams({ strict: false });
  const matchRoute = useMatchRoute();
  const erInnsendt = !!matchRoute({ to: "/skjema/$id/innsendt" });

  if (skjemaId && !erInnsendt) {
    return <SkjemaParterHeader skjemaId={skjemaId} />;
  }

  const erSkjemaStart = !!matchRoute({ to: "/skjema/start" });
  const nySoknad = erSkjemaStart ? hentNySoknad() : undefined;

  // Introsiden: utkastet finnes ikke ennå, så partene hentes fra opplysningene i minnet.
  return nySoknad ? (
    <SkjemaParter
      arbeidsgiver={nySoknad.request.arbeidsgiver}
      arbeidstaker={{
        navn: nySoknad.arbeidstakerNavn,
        fnr: nySoknad.request.arbeidstaker.fnr,
      }}
      representasjonstype={nySoknad.request.representasjonstype}
    />
  ) : (
    <Stack
      align={{ xs: "end", md: "center" }}
      direction={{ xs: "column-reverse", md: "row" }}
      gap="space-4 space-16"
      justify="space-between"
      paddingBlock="space-12"
      style={{ minHeight: "5rem" }}
      wrap={false}
    >
      <Heading className="w-full min-w-0" level="1" size="small">
        {t("appHeader.tittel")}
      </Heading>
      <div className="shrink-0">
        {representasjonskontekst ? <KontekstVelger /> : <MaalformVelger />}
      </div>
    </Stack>
  );
}
