import { Alert, Detail, ErrorMessage, HStack, Loader } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  getSkjemaQuery,
  UtdatertKlientError,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { getStegRekkefolge } from "~/pages/skjema/stegRekkefølge.ts";

interface SkjemaRedirectProperties {
  id: string;
}

export function SkjemaRedirect({ id }: SkjemaRedirectProperties) {
  const { data: skjema, isLoading, error } = useQuery(getSkjemaQuery(id));
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <HStack style={{ gap: "var(--a-spacing-2)" }}>
        <Loader />
        <Detail>{t("felles.laster")}</Detail>
      </HStack>
    );
  }

  if (error instanceof UtdatertKlientError) {
    return <Alert variant="info">{t("felles.skjemaOppdateres")}</Alert>;
  }

  if (error || !skjema) {
    return <ErrorMessage>{t("felles.feil")}</ErrorMessage>;
  }

  const stegRekkefolge = getStegRekkefolge(skjema);

  return <Navigate params={{ id }} to={stegRekkefolge[0]!.route} />;
}
