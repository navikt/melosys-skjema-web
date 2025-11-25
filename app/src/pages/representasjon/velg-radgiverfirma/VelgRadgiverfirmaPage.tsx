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
  const [feilmelding, setFeilmelding] = useState<string | null>(null);

  const handleOrganisasjonValgt = (
    organisasjon: SimpleOrganisasjonDto,
  ): void => {
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

    void navigate({ to: "/representasjon/arbeidsgiver-som-radgiver" });
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
