import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Label,
  VStack,
} from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { opprettSoknadMedKontekst } from "~/httpClients/melsosysSkjemaApiClient";
import {
  OpprettSoknadMedKontekstRequest,
  PersonDto,
  SimpleOrganisasjonDto,
} from "~/types/melosysSkjemaTypes";

interface StartSoknadPageProps {
  kontekst: OpprettSoknadMedKontekstRequest;
  arbeidsgiver?: SimpleOrganisasjonDto;
  arbeidstaker?: PersonDto;
}

export function StartSoknadPage({
  kontekst,
  arbeidsgiver,
  arbeidstaker,
}: StartSoknadPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const opprettSoknadMutation = useMutation({
    mutationFn: opprettSoknadMedKontekst,
    onSuccess: (data) => {
      // Naviger til felles skjema-inngang som bestemmer type basert på backend-data
      void navigate({
        to: `/skjema/${data.id}`,
      });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console -- Nyttig for debugging i utviklingsmiljø
      console.error("Feil ved opprettelse av søknad:", error);
      // Feilmeldingen vises automatisk via mutation.isError og Alert-komponenten
    },
  });

  const handleStartSoknad = () => {
    // Konverter til OpprettSoknadMedKontekstRequest
    const request = {
      representasjonstype: kontekst.representasjonstype,
      radgiverfirma: kontekst.radgiverfirma,
      arbeidsgiver,
      arbeidstaker,
      harFullmakt: kontekst.harFullmakt,
    };

    opprettSoknadMutation.mutate(request);
  };

  const handleAvbryt = () => {
    void navigate({ to: "/oversikt" });
  };

  // Burde ikke skje pga beforeLoad guard, men TypeScript vet ikke dette
  if (!arbeidsgiver && kontekst.representasjonstype !== "DEG_SELV") {
    return null;
  }
  if (!arbeidstaker && kontekst.representasjonstype !== "DEG_SELV") {
    return null;
  }

  return (
    <VStack gap="6">
      <Heading level="1" size="large">
        {t("startSoknad.tittel")}
      </Heading>

      <BodyShort>{t("startSoknad.beskrivelse")}</BodyShort>

      {/* Rådgiverfirma-seksjon */}
      {kontekst.radgiverfirma && (
        <Box
          background="surface-default"
          borderColor="border-subtle"
          borderRadius="medium"
          borderWidth="1"
          padding="6"
        >
          <VStack gap="4">
            <Heading level="2" size="medium">
              {t("startSoknad.radgiverfirmaTittel")}
            </Heading>
            <div>
              <Label>{t("startSoknad.organisasjonsnavn")}</Label>
              <BodyShort>{kontekst.radgiverfirma.navn}</BodyShort>
            </div>
            <div>
              <Label>{t("startSoknad.organisasjonsnummer")}</Label>
              <BodyShort>{kontekst.radgiverfirma.orgnr}</BodyShort>
            </div>
          </VStack>
        </Box>
      )}

      {/* Arbeidsgiver-seksjon */}
      {arbeidsgiver && (
        <Box
          background="surface-default"
          borderColor="border-subtle"
          borderRadius="medium"
          borderWidth="1"
          padding="6"
        >
          <VStack gap="4">
            <Heading level="2" size="medium">
              {t("oversiktFelles.arbeidsgiverTittel")}
            </Heading>
            <div>
              <Label>{t("startSoknad.organisasjonsnavn")}</Label>
              <BodyShort>{arbeidsgiver.navn}</BodyShort>
            </div>
            <div>
              <Label>{t("startSoknad.organisasjonsnummer")}</Label>
              <BodyShort>{arbeidsgiver.orgnr}</BodyShort>
            </div>
          </VStack>
        </Box>
      )}

      {/* Arbeidstaker-seksjon */}
      {arbeidstaker && (
        <Box
          background="surface-default"
          borderColor="border-subtle"
          borderRadius="medium"
          borderWidth="1"
          padding="6"
        >
          <VStack gap="4">
            <Heading level="2" size="medium">
              {t("oversiktFelles.arbeidstakerTittel")}
            </Heading>

            {kontekst.harFullmakt && (
              <Alert variant="info">{t("startSoknad.duHarFullmakt")}</Alert>
            )}

            <div>
              {/* TODO: Avklare/ nøste opp i person dtoene våre*/}
              <Label>{t("startSoknad.navn")}</Label>
              <BodyShort>{arbeidstaker.etternavn}</BodyShort>
            </div>
            <div>
              <Label>{t("startSoknad.fodselsnummer")}</Label>
              <BodyShort>{arbeidstaker.fnr}</BodyShort>
            </div>
          </VStack>
        </Box>
      )}

      {opprettSoknadMutation.isError && (
        <Alert variant="error">{t("startSoknad.feilVedOpprettelse")}</Alert>
      )}

      <HStack gap="4" justify="center">
        <Button
          disabled={opprettSoknadMutation.isPending}
          onClick={handleAvbryt}
          variant="secondary"
        >
          {t("felles.avbryt")}
        </Button>
        <Button
          loading={opprettSoknadMutation.isPending}
          onClick={handleStartSoknad}
          variant="primary"
        >
          {t("startSoknad.startSoknadKnapp")}
        </Button>
      </HStack>
    </VStack>
  );
}
