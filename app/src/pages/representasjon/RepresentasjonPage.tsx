import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, ErrorMessage, Loader, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { RepresentasjonVelger } from "~/components/RepresentasjonVelger.tsx";
import { VELG_SITUASJON } from "~/featuretoggle/toggleNavn.ts";
import { useFeatureToggle } from "~/featuretoggle/useFeatureToggle.ts";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { VALG_DIGITAL_ELLER_PAPIR_URL } from "~/pages/velgSituasjon/VelgSituasjonPage.tsx";

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

/**
Tilbake til siden brukeren kom fra: velg situasjon når togglen er på, ellers nav.no sin mellomside.
*/
function GaTilbakeKnapp() {
  const { t } = useTranslation();
  const velgSituasjonAktiv = useFeatureToggle(VELG_SITUASJON) ?? false;
  const knappProps = {
    icon: <ArrowLeftIcon aria-hidden />,
    variant: "secondary",
  } as const;

  return (
    <div>
      {velgSituasjonAktiv ? (
        <Button {...knappProps} as={Link} to="/velg-situasjon">
          {t("velgSituasjon.gaTilbake")}
        </Button>
      ) : (
        <Button {...knappProps} as="a" href={VALG_DIGITAL_ELLER_PAPIR_URL}>
          {t("velgSituasjon.gaTilbake")}
        </Button>
      )}
    </div>
  );
}
