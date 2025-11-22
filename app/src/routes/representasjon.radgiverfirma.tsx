import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  BodyShort,
  Button,
  Heading,
  HStack,
  Search,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { getOrganisasjonQuery } from "~/httpClients/melsosysSkjemaApiClient";
import {
  type RadgiverfirmaFormData,
  radgiverfirmaSchema,
} from "~/pages/representasjon/radgiverfirma/radgiverfirmaSchema";
import type { Organisasjon } from "~/types/representasjon";
import {
  clearRepresentasjonKontekst,
  getRepresentasjonKontekst,
  setRepresentasjonKontekst,
} from "~/utils/sessionStorage";
import { useTranslateError } from "~/utils/translation";

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
  const translateError = useTranslateError();
  const navigate = useNavigate();
  const { kontekst } = Route.useRouteContext();

  const [orgnummerToSok, setOrgnummerToSok] = useState<string | null>(null);
  const [valgtFirma, setValgtFirma] = useState<Organisasjon | null>(null);
  const [sokFeil, setSokFeil] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const {
    handleSubmit: handleSokSubmit,
    setValue,
    formState: { errors },
  } = useForm<RadgiverfirmaFormData>({
    resolver: zodResolver(radgiverfirmaSchema),
    mode: "onSubmit",
  });

  const organisasjonQuery = useQuery({
    ...getOrganisasjonQuery(orgnummerToSok || ""),
    enabled: !!orgnummerToSok && orgnummerToSok.length === 9,
  });

  // Håndter søkeresultat
  if (
    organisasjonQuery.isSuccess &&
    orgnummerToSok &&
    !valgtFirma &&
    !organisasjonQuery.isFetching
  ) {
    const juridiskEnhet = organisasjonQuery.data.juridiskEnhet;
    const navn =
      juridiskEnhet.navn?.sammensattnavn ||
      juridiskEnhet.navn?.navnelinje1 ||
      "";

    setValgtFirma({
      orgnr: juridiskEnhet.organisasjonsnummer,
      navn: navn,
    });
    setSokFeil(null);
  }

  if (
    organisasjonQuery.isError &&
    orgnummerToSok &&
    !sokFeil &&
    !organisasjonQuery.isFetching
  ) {
    setSokFeil(t("velgRadgiverfirma.organisasjonIkkeFunnet"));
    setValgtFirma(null);
  }

  const onSok = (data: RadgiverfirmaFormData): void => {
    setSokFeil(null);
    setValgtFirma(null);
    setOrgnummerToSok(data.organisasjonsnummer.trim());
  };

  const handleOk = (): void => {
    if (!valgtFirma) {
      setSokFeil(t("velgRadgiverfirma.duMaSokeForstFeil"));
      return;
    }

    setRepresentasjonKontekst({
      ...kontekst,
      radgiverfirma: valgtFirma,
    });

    navigate({ to: "/oversikt" });
  };

  const handleAvbryt = (): void => {
    // Fjern kontekst helt - brukeren må velge på nytt
    clearRepresentasjonKontekst();
    navigate({ to: "/" });
  };

  const handleClear = (): void => {
    setSearchValue("");
    setValgtFirma(null);
    setSokFeil(null);
    setOrgnummerToSok(null);
  };

  if (!kontekst) return null;

  const errorMessage =
    translateError(errors.organisasjonsnummer?.message) || sokFeil;

  return (
    <>
      <VStack className="mt-8" gap="6">
        <Heading level="1" size="medium">
          {t("velgRadgiverfirma.tittel")}
        </Heading>

        <BodyShort>{t("velgRadgiverfirma.informasjon")}</BodyShort>

        <div className="max-w-[28rem] w-full">
          <Search
            autoFocus
            error={errorMessage || undefined}
            hideLabel={false}
            label={t("velgRadgiverfirma.sokPaVirksomhet")}
            onChange={(value: string) => setSearchValue(value)}
            onClear={handleClear}
            onSearchClick={(value: string) => {
              setValue("organisasjonsnummer", value);
              handleSokSubmit(onSok)();
            }}
            role={"search"}
            size="medium"
            value={searchValue}
          />
        </div>

        {valgtFirma && (
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
          <Button onClick={handleOk} size="medium">
            {t("velgRadgiverfirma.ok")}
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
