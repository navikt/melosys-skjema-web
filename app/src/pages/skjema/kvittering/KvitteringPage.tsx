import { InformationSquareIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  Button,
  Detail,
  ErrorMessage,
  Heading,
  HStack,
  InfoCard,
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
import { AaregVarsel } from "~/pages/skjema/components/AaregVarsel.tsx";
import type {
  SkjemaInnsendtKvittering,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import { toRepresentasjonskontekst } from "~/types/representasjon.ts";

interface KvitteringPageProperties {
  skjemaId: string;
}

export function KvitteringPage({ skjemaId }: KvitteringPageProperties) {
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

  return kvitteringError || skjemaError || !kvittering || !skjema ? (
    <ErrorMessage>{t("felles.feil")}</ErrorMessage>
  ) : (
    <KvitteringPageContent response={kvittering} skjema={skjema} />
  );
}

interface KvitteringPageContentProperties {
  response: SkjemaInnsendtKvittering;
  skjema: UtsendtArbeidstakerSkjemaDto;
}

function KvitteringPageContent({
  response,
  skjema,
}: KvitteringPageContentProperties) {
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
      <InfoCard data-color="info">
        <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
          {t("kvittering.infoOversikt")}
        </InfoCard.Message>
      </InfoCard>
      {skjema.metadata.harArbeidsforholdIAareg === false && (
        <AaregVarsel
          arbeidsgiverNavn={skjema.metadata.arbeidsgiverNavn}
          arbeidstakerNavn={skjema.metadata.arbeidstakerNavn}
          representasjonstype={skjema.metadata.representasjonstype}
        />
      )}
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
