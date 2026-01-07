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
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { getInnsendtKvitteringQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { SkjemaInnsendtKvittering } from "~/types/melosysSkjemaTypes.ts";

interface KvitteringPageProps {
  id: string;
}

export function KvitteringPage({ id }: KvitteringPageProps) {
  const { t } = useTranslation();
  const {
    data: kvittering,
    isLoading,
    error,
  } = useQuery(getInnsendtKvitteringQuery(id));

  if (isLoading) {
    return (
      <HStack style={{ gap: "var(--a-spacing-2)" }}>
        <Loader />
        <Detail>{t("felles.laster")}</Detail>
      </HStack>
    );
  }

  return error ? (
    <ErrorMessage>{t("felles.feil")}</ErrorMessage>
  ) : (
    <KvitteringPageContent response={kvittering!} />
  );
}

interface KvitteringPageContentProps {
  response: SkjemaInnsendtKvittering;
}

function KvitteringPageContent({ response }: KvitteringPageContentProps) {
  const { t } = useTranslation();

  return (
    <VStack gap="6">
      {/* Hovedtittel */}
      <Heading level="1" size="large">
        {t("kvittering.tittel")}
      </Heading>

      {/* Melding med referanse */}
      <BodyLong>
        {t("kvittering.melding")} <strong>{response.referanseId}</strong>.
      </BodyLong>

      {/* Info om oversiktssiden */}
      <Alert variant="info">{t("kvittering.infoOversikt")}</Alert>

      {/* Knapp til oversikt */}
      <Button
        as={Link}
        style={{ width: "fit-content" }}
        to="/oversikt"
        variant="primary"
      >
        {t("kvittering.tilOversikt")}
      </Button>
    </VStack>
  );
}
