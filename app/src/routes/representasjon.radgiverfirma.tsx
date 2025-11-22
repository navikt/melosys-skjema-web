import { BodyShort, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker";
import type { Organisasjon } from "~/types/representasjon";
import {
  clearRepresentasjonKontekst,
  getRepresentasjonKontekst,
  setRepresentasjonKontekst,
} from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/radgiverfirma")({
  component: RadgiverfirmaRoute,
  beforeLoad: () => {
    const kontekst = getRepresentasjonKontekst();

    if (!kontekst || kontekst.type !== "RADGIVER") {
      throw redirect({ to: "/" });
    }

    return {
      hideSiteTitle: true,
      kontekst,
    };
  },
});

function RadgiverfirmaRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { kontekst } = Route.useRouteContext();
  const [valgtFirma, setValgtFirma] = useState<Organisasjon | null>(null);
  const [feilmelding, setFeilmelding] = useState<string | null>(null);

  const handleOrganisasjonValgt = (organisasjon: Organisasjon): void => {
    setValgtFirma(organisasjon);
    setFeilmelding(null);
  };

  const handleOk = (): void => {
    if (!valgtFirma) {
      setFeilmelding(t("velgRadgiverfirma.duMaSokeForstFeil"));
      return;
    }

    setRepresentasjonKontekst({
      ...kontekst,
      radgiverfirma: valgtFirma,
    });

    void navigate({ to: "/oversikt" });
  };

  const handleAvbryt = (): void => {
    clearRepresentasjonKontekst();
    void navigate({ to: "/" });
  };

  if (!kontekst) return null;

  return (
    <>
      <VStack className="mt-8" gap="6">
        <Heading level="1" size="medium">
          {t("velgRadgiverfirma.tittel")}
        </Heading>

        <BodyShort>{t("velgRadgiverfirma.informasjon")}</BodyShort>

        <OrganisasjonSoker
          autoFocus
          label={t("velgRadgiverfirma.sokPaVirksomhet")}
          onOrganisasjonValgt={handleOrganisasjonValgt}
        />

        {feilmelding && (
          <BodyShort className="text-red-600">{feilmelding}</BodyShort>
        )}

        <HStack className="mt-4" gap="4" justify="end">
          <Button onClick={handleAvbryt} size="medium" variant="secondary">
            {t("felles.avbryt")}
          </Button>
          <Button onClick={handleOk} size="medium">
            {t("velgRadgiverfirma.ok")}
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
