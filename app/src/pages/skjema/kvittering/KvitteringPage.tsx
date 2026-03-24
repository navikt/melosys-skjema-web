import {
  Alert,
  BodyLong,
  Button,
  Detail,
  ErrorMessage,
  Heading,
  HStack,
  Loader,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  getInnsendtKvitteringQuery,
  getSkjemaQuery,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type {
  SkjemaInnsendtKvittering,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import { toRepresentasjonskontekst } from "~/types/representasjon.ts";

interface KvitteringPageProps {
  skjemaId: string;
}

export function KvitteringPage({ skjemaId }: KvitteringPageProps) {
  const { t } = useTranslation();
  const {
    data: kvittering,
    isLoading: kvitteringLoading,
    error: kvitteringError,
  } = useQuery(getInnsendtKvitteringQuery(skjemaId));
  const {
    data: skjema,
    isLoading: skjemaLoading,
    error: skjemaError,
  } = useQuery(getSkjemaQuery(skjemaId));

  if (kvitteringLoading || skjemaLoading) {
    return (
      <HStack style={{ gap: "var(--a-spacing-2)" }}>
        <Loader />
        <Detail>{t("felles.laster")}</Detail>
      </HStack>
    );
  }

  if (kvitteringError || skjemaError || !kvittering || !skjema) {
    return <ErrorMessage>{t("felles.feil")}</ErrorMessage>;
  }

  return <KvitteringPageContent response={kvittering} skjema={skjema} />;
}

interface KvitteringPageContentProps {
  response: SkjemaInnsendtKvittering;
  skjema: UtsendtArbeidstakerSkjemaDto;
}

function KvitteringPageContent({
  response,
  skjema,
}: KvitteringPageContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const representasjonskontekst = toRepresentasjonskontekst(skjema.metadata);

  const handleTilOversikt = () => {
    void navigate({
      to: "/oversikt",
      search: representasjonskontekst,
    });
  };

  return (
    <VStack gap="space-24">
      <Heading level="1" size="large">
        {t("kvittering.tittel")}
      </Heading>
      <BodyLong>
        {t("kvittering.melding")} <strong>{response.referanseId}</strong>.
      </BodyLong>
      <Alert variant="info">{t("kvittering.infoOversikt")}</Alert>
      <Button
        onClick={handleTilOversikt}
        style={{ width: "fit-content" }}
        variant="primary"
      >
        {t("kvittering.tilOversikt")}
      </Button>
    </VStack>
  );
}
