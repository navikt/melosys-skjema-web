import {
  Alert,
  BodyShort,
  Button,
  Detail,
  Heading,
  HStack,
  Loader,
  Tag,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { SeksjonOppsummering } from "~/components/oppsummering/SeksjonOppsummering.tsx";
import { getInnsendtSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { InnsendtSkjemaResponse } from "~/types/melosysSkjemaTypes.ts";

import { resolveSeksjoner } from "../../../components/oppsummering/dataMapping.ts";

interface InnsendtSkjemaPageProps {
  id: string;
}

const formatDato = (dato: string) => {
  return new Date(dato).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function InnsendtSkjemaPage({ id }: InnsendtSkjemaPageProps) {
  const { i18n, t } = useTranslation();
  const sprak = i18n.language === "en" ? "en" : "nb";
  const { data, error, isLoading } = useQuery(
    getInnsendtSkjemaQuery(id, sprak),
  );

  if (isLoading) {
    return (
      <HStack style={{ gap: "var(--a-spacing-2)" }}>
        <Loader />
        <Detail>{t("felles.laster")}</Detail>
      </HStack>
    );
  }

  if (error || !data) {
    return <Alert variant="error">{t("innsendtSkjema.feilVedLasting")}</Alert>;
  }

  return <InnsendtSkjemaPageContent response={data} />;
}

function InnsendtSkjemaPageContent({
  response,
}: {
  response: InnsendtSkjemaResponse;
}) {
  const { t } = useTranslation();

  const arbeidstakerSeksjoner = response.arbeidstakerData
    ? resolveSeksjoner(
        response.arbeidstakerData,
        response.definisjon,
      )
    : [];

  const arbeidsgiverSeksjoner = response.arbeidsgiverData
    ? resolveSeksjoner(
        response.arbeidsgiverData,
        response.definisjon,
      )
    : [];

  return (
    <VStack gap="space-24">
      <Heading level="1" size="large">
        {t("innsendtSkjema.tittel")}
      </Heading>

      <HStack gap="space-16">
        <Tag variant="info">{response.referanseId}</Tag>
        <BodyShort>{formatDato(response.innsendtDato)}</BodyShort>
      </HStack>

      {arbeidstakerSeksjoner.length > 0 && (
        <VStack gap="space-16">
          <Heading level="2" size="medium">
            {t("innsendtSkjema.arbeidstakersDel")}
          </Heading>
          {arbeidstakerSeksjoner.map(({ seksjonNavn, seksjon, data }) => (
            <SeksjonOppsummering
              data={data}
              key={seksjonNavn}
              seksjon={seksjon}
            />
          ))}
        </VStack>
      )}

      {arbeidsgiverSeksjoner.length > 0 && (
        <VStack gap="space-16">
          <Heading level="2" size="medium">
            {t("innsendtSkjema.arbeidsgiverDel")}
          </Heading>
          {arbeidsgiverSeksjoner.map(({ seksjonNavn, seksjon, data }) => (
            <SeksjonOppsummering
              data={data}
              key={seksjonNavn}
              seksjon={seksjon}
            />
          ))}
        </VStack>
      )}

      <Button
        as={Link}
        style={{ width: "fit-content" }}
        to="/oversikt"
        variant="secondary"
      >
        {t("innsendtSkjema.tilbakeTilOversikt")}
      </Button>
    </VStack>
  );
}
