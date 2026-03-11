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
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { SeksjonOppsummering } from "~/components/oppsummering/SeksjonOppsummering.tsx";
import { VedleggOppsummering } from "~/components/oppsummering/VedleggOppsummering.tsx";
import {
  getInnsendtSkjemaQuery,
  getSkjemaQuery,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type {
  InnsendtSkjemaResponse,
  UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto,
  UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
  UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import { toRepresentasjonsKontekst } from "~/types/representasjon.ts";

import { resolveSeksjoner } from "../../../components/oppsummering/dataMapping.ts";

interface InnsendtSkjemaPageProps {
  skjemaId: string;
}

const formatDato = (dato: string) => {
  return new Date(dato).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function InnsendtSkjemaPage({ skjemaId }: InnsendtSkjemaPageProps) {
  const { i18n, t } = useTranslation();
  const sprak = i18n.language === "en" ? "en" : "nb";
  const {
    data: innsendtSkjema,
    error: innsendtError,
    isLoading: innsendtLoading,
  } = useQuery(getInnsendtSkjemaQuery(skjemaId, sprak));
  const {
    data: skjema,
    isLoading: skjemaLoading,
    error: skjemaError,
  } = useQuery(getSkjemaQuery(skjemaId));

  if (innsendtLoading || skjemaLoading) {
    return (
      <HStack style={{ gap: "var(--a-spacing-2)" }}>
        <Loader />
        <Detail>{t("felles.laster")}</Detail>
      </HStack>
    );
  }

  if (innsendtError || skjemaError || !innsendtSkjema || !skjema) {
    return <Alert variant="error">{t("innsendtSkjema.feilVedLasting")}</Alert>;
  }

  return (
    <InnsendtSkjemaPageContent response={innsendtSkjema} skjema={skjema} />
  );
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
  skjema,
}: {
  response: InnsendtSkjemaResponse;
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const kontekst = toRepresentasjonsKontekst(skjema.metadata);

  const handleTilOversikt = () => {
    void navigate({
      to: "/oversikt",
      search: kontekst,
    });
  };

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
        onClick={handleTilOversikt}
        style={{ width: "fit-content" }}
        variant="secondary"
      >
        {t("innsendtSkjema.tilbakeTilOversikt")}
      </Button>
    </VStack>
  );
}
