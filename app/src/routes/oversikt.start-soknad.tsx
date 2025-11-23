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
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { opprettSoknadMedKontekst } from "~/httpClients/melsosysSkjemaApiClient";
import type {
  Organisasjon,
  Person,
  RepresentasjonskontekstDto,
} from "~/types/representasjon";
import { validerSoknadKontekst } from "~/utils/valideringUtils";

export interface StartSoknadLocationState {
  arbeidsgiver?: Organisasjon;
  arbeidstaker?: Person;
  kontekst: RepresentasjonskontekstDto;
}

export const Route = createFileRoute("/oversikt/start-soknad")({
  component: StartSoknadRoute,
  beforeLoad: ({ location }) => {
    const state = location.state as unknown as
      | StartSoknadLocationState
      | undefined;

    // Redirect til oversikt hvis state mangler (f.eks. ved refresh)
    if (!state || !state.kontekst) {
      throw redirect({ to: "/oversikt" });
    }

    // Valider at nødvendig data er tilstede
    const kontekst = state.kontekst;
    const arbeidsgiver = state.arbeidsgiver;
    const arbeidstaker = state.arbeidstaker;

    // Redirect til oversikt hvis validering feiler
    const validering = validerSoknadKontekst(
      kontekst,
      arbeidsgiver,
      arbeidstaker,
    );

    if (!validering.gyldig) {
      throw redirect({ to: "/oversikt" });
    }

    return {
      hideSiteTitle: true,
      kontekst,
      arbeidsgiver,
      arbeidstaker,
    };
  },
});

function StartSoknadRoute() {
  const { kontekst, arbeidsgiver, arbeidstaker } = Route.useRouteContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const opprettSoknadMutation = useMutation({
    mutationFn: opprettSoknadMedKontekst,
    onSuccess: (data) => {
      // Naviger til riktig skjema basert på representasjonstype
      const skjemaType =
        kontekst.type === "DEG_SELV" ? "arbeidstaker" : "arbeidsgiver";

      void navigate({
        to: `/skjema/${skjemaType}/${data.id}`,
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
      representasjonstype: kontekst.type,
      radgiverfirma: kontekst.radgiverfirma,
      arbeidsgiver,
      arbeidstaker: arbeidstaker
        ? {
            fnr: arbeidstaker.fnr,
            etternavn: arbeidstaker.etternavn, // Kun sendes hvis uten fullmakt
          }
        : undefined,
      harFullmakt: kontekst.harFullmakt,
    };

    opprettSoknadMutation.mutate(request);
  };

  const handleAvbryt = () => {
    void navigate({ to: "/oversikt" });
  };

  // Burde ikke skje pga beforeLoad guard, men TypeScript vet ikke dette
  if (!arbeidsgiver && kontekst.type !== "DEG_SELV") {
    return null;
  }
  if (!arbeidstaker && kontekst.type !== "DEG_SELV") {
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
              <Label>{t("startSoknad.navn")}</Label>
              <BodyShort>{arbeidstaker.navn}</BodyShort>
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
