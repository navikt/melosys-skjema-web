import { ErrorMessage, Loader } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { RepresentasjonVelger } from "~/components/RepresentasjonVelger.tsx";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";

export function RepresentasjonPage() {
  const { t } = useTranslation();
  const userInfoQuery = useQuery(getUserInfo());

  if (userInfoQuery.isLoading) {
    return <Loader size="xlarge" title={t("felles.laster")} />;
  }

  if (userInfoQuery.isError) {
    return (
      <ErrorMessage>
        {t("felles.feil")}: {`${userInfoQuery.error}`}
      </ErrorMessage>
    );
  }

  if (!userInfoQuery.data) {
    return <Loader size="xlarge" title={t("felles.laster")} />;
  }

  return <RepresentasjonVelger />;
}
