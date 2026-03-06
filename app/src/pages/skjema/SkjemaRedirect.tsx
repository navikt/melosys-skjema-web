import { Detail, ErrorMessage, HStack, Loader } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { STEG_REKKEFOLGE } from "~/pages/skjema/stegRekkefølge.ts";

interface SkjemaRedirectProps {
  id: string;
}

export function SkjemaRedirect({ id }: SkjemaRedirectProps) {
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

  if (error || !skjema) {
    return <ErrorMessage>{t("felles.feil")}</ErrorMessage>;
  }

  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];

  return <Navigate params={{ id }} to={stegRekkefolge[0]!.route} />;
}
