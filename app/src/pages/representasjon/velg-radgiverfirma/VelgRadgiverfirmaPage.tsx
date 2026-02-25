import { BodyShort, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker.tsx";
import { Route } from "~/routes/representasjon.velg-radgiverfirma.tsx";
import { SimpleOrganisasjonDto } from "~/types/melosysSkjemaTypes.ts";
import {
  clearRepresentasjonKontekst,
  setRepresentasjonKontekst,
} from "~/utils/sessionStorage.ts";

export function VelgRadgiverfirmaPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { kontekst } = Route.useRouteContext();
  const [valgtFirma, setValgtFirma] = useState<SimpleOrganisasjonDto | null>(
    null,
  );
  const [submitted, setSubmitted] = useState(false);

  const handleOrganisasjonValgt = (
    organisasjon: SimpleOrganisasjonDto | null,
  ): void => {
    setValgtFirma(organisasjon);
    setSubmitted(false);
  };

  const handleOk = (): void => {
    if (!valgtFirma) {
      setSubmitted(true);
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
      <VStack className="mt-8" gap="space-24">
        <Heading level="1" size="medium">
          {t("velgRadgiverfirma.tittel")}
        </Heading>

        <BodyShort>{t("velgRadgiverfirma.informasjon")}</BodyShort>

        <OrganisasjonSoker
          autoFocus
          label={t("velgRadgiverfirma.sokPaVirksomhet")}
          onOrganisasjonValgt={handleOrganisasjonValgt}
          submitted={submitted}
        />

        <HStack className="mt-4" gap="space-16" justify="end">
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
