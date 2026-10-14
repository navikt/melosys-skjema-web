import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, ErrorMessage, Loader, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
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

  return userInfoQuery.data ? (
    <VStack gap="space-24">
      <RepresentasjonVelger />
      <GaTilbakeKnapp />
    </VStack>
  ) : (
    <Loader size="xlarge" title={t("felles.laster")} />
  );
}

function GaTilbakeKnapp() {
  const { t } = useTranslation();

  // TODO (fagavklaring 15.10.2026): Avklar tilbakeknapp for direkte inngang fra eksterne parter.
  return (
    <div>
      <Button
        as={Link}
        to="/velg-situasjon"
        icon={<ArrowLeftIcon aria-hidden />}
        variant="secondary"
      >
        {t("velgSituasjon.gaTilbake")}
      </Button>
    </div>
  );
}
