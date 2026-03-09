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
import { VedleggOppsummering } from "~/components/oppsummering/VedleggOppsummering.tsx";
import { getInnsendtSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import type {
  InnsendtSkjemaResponse,
  UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto,
  UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
  UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
} from "~/types/melosysSkjemaTypes.ts";

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

// dto.type verdier
const ARBEIDSTAKERS_DEL = "UTSENDT_ARBEIDSTAKER_ARBEIDSTAKERS_DEL";
const ARBEIDSGIVERS_DEL = "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVERS_DEL";
const ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL =
  "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL";

function getArbeidstakerData(
  skjemaData: InnsendtSkjemaResponse["skjemaData"],
): UtsendtArbeidstakerArbeidstakersSkjemaDataDto | undefined {
  if (skjemaData.type === ARBEIDSTAKERS_DEL) {
    return skjemaData as UtsendtArbeidstakerArbeidstakersSkjemaDataDto;
  }
  if (skjemaData.type === ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL) {
    const combined =
      skjemaData as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto;
    return {
      ...combined.arbeidstakersData,
      tilleggsopplysninger: combined.tilleggsopplysninger,
      utsendingsperiodeOgLand: combined.utsendingsperiodeOgLand,
      type: ARBEIDSTAKERS_DEL,
    } as UtsendtArbeidstakerArbeidstakersSkjemaDataDto;
  }
  return undefined;
}

function getArbeidsgiverData(
  skjemaData: InnsendtSkjemaResponse["skjemaData"],
): UtsendtArbeidstakerArbeidsgiversSkjemaDataDto | undefined {
  if (skjemaData.type === ARBEIDSGIVERS_DEL) {
    return skjemaData as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto;
  }
  if (skjemaData.type === ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL) {
    const combined =
      skjemaData as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto;
    return {
      ...combined.arbeidsgiversData,
      tilleggsopplysninger: combined.tilleggsopplysninger,
      utsendingsperiodeOgLand: combined.utsendingsperiodeOgLand,
      type: ARBEIDSGIVERS_DEL,
    } as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto;
  }
  return undefined;
}

function InnsendtSkjemaPageContent({
  response,
}: {
  response: InnsendtSkjemaResponse;
}) {
  const { t } = useTranslation();

  const arbeidstakerSeksjoner = (() => {
    const data = getArbeidstakerData(response.skjemaData);
    return data ? resolveSeksjoner(data, response.definisjon) : [];
  })();

  const arbeidsgiverSeksjoner = (() => {
    const data = getArbeidsgiverData(response.skjemaData);
    return data ? resolveSeksjoner(data, response.definisjon) : [];
  })();

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

      <VedleggOppsummering skjemaId={response.skjemaId} />

      <Button
        as={Link}
        style={{ width: "fit-content" }}
        to="/"
        variant="secondary"
      >
        {t("innsendtSkjema.tilbakeTilOversikt")}
      </Button>
    </VStack>
  );
}
