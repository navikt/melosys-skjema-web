import {
  Alert,
  BodyShort,
  Button,
  Heading,
  HStack,
  Loader,
  Search,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getOrganisasjonQuery } from "~/httpClients/melsosysSkjemaApiClient";
import { radgiverfirmaSchema } from "~/pages/representasjon/radgiverfirma/radgiverfirmaSchema";
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

  const [orgnummerToSok, setOrgnummerToSok] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const organisasjonQuery = useQuery({
    ...getOrganisasjonQuery(orgnummerToSok || ""),
    enabled: !!orgnummerToSok && orgnummerToSok.length === 9,
  });

  const valgtFirma = useMemo((): Organisasjon | null => {
    if (!organisasjonQuery.data) return null;

    return {
      orgnr: organisasjonQuery.data.juridiskEnhet.organisasjonsnummer,
      navn:
        organisasjonQuery.data.juridiskEnhet.navn?.sammensattnavn ||
        organisasjonQuery.data.juridiskEnhet.navn?.navnelinje1 ||
        "",
    };
  }, [organisasjonQuery.data]);

  const errorMessage = useMemo((): string | null => {
    if (validationError) return validationError;
    if (!organisasjonQuery.isError) return null;

    const error = organisasjonQuery.error;
    const statusMatch = error.message.match(/status:\s*(\d+)/);
    const status = statusMatch ? statusMatch[1] : null;

    if (status === "429") {
      return t("velgRadgiverfirma.rateLimitOverskredet");
    }
    if (status === "404") {
      return t("velgRadgiverfirma.organisasjonIkkeFunnet");
    }
    return t("velgRadgiverfirma.feilVedSok");
  }, [validationError, organisasjonQuery.isError, organisasjonQuery.error, t]);

  const handleSearch = (value: string): void => {
    const result = radgiverfirmaSchema.safeParse({
      organisasjonsnummer: value,
    });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message;
      setValidationError(errorMessage ? t(errorMessage) : null);
      setOrgnummerToSok(null);
      return;
    }

    setValidationError(null);
    setOrgnummerToSok(value.trim());
  };

  const handleOk = (): void => {
    if (!valgtFirma) {
      setValidationError(t("velgRadgiverfirma.duMaSokeForstFeil"));
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

  const handleClear = (): void => {
    setSearchValue("");
    setValidationError(null);
    setOrgnummerToSok(null);
  };

  if (!kontekst) return null;

  return (
    <>
      <VStack className="mt-8" gap="6">
        <Heading level="1" size="medium">
          {t("velgRadgiverfirma.tittel")}
        </Heading>

        <BodyShort>{t("velgRadgiverfirma.informasjon")}</BodyShort>

        <div className="max-w-md w-full">
          <Search
            autoFocus
            error={errorMessage || undefined}
            hideLabel={false}
            label={t("velgRadgiverfirma.sokPaVirksomhet")}
            onChange={(value: string) => setSearchValue(value)}
            onClear={handleClear}
            onSearchClick={handleSearch}
            size="medium"
            value={searchValue}
          />
        </div>

        {organisasjonQuery.isFetching && (
          <div aria-live="polite" role="status">
            <Loader size="medium" title={t("felles.laster")} />
          </div>
        )}

        {valgtFirma && !organisasjonQuery.isFetching && (
          <Alert variant="success">
            <Heading level="3" size="small">
              {t("velgRadgiverfirma.valgtFirma")}
            </Heading>
            <BodyShort>
              {valgtFirma.navn} (org.nr. {valgtFirma.orgnr})
            </BodyShort>
          </Alert>
        )}

        <HStack className="mt-4" gap="4" justify="end">
          <Button onClick={handleAvbryt} size="medium" variant="secondary">
            {t("felles.avbryt")}
          </Button>
          <Button
            disabled={organisasjonQuery.isFetching}
            onClick={handleOk}
            size="medium"
          >
            {t("velgRadgiverfirma.ok")}
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
