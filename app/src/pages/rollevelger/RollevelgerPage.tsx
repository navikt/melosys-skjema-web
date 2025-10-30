import { Buildings3Icon, PersonIcon } from "@navikt/aksel-icons";
import { Box, ErrorMessage, Heading, LinkCard, Page } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { listAltinnTilganger } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { setValgtRolle } from "~/utils/sessionStorage.ts";

export function RollevelgerPage() {
  const { t } = useTranslation();
  const altinnTilgangerQuery = useQuery(listAltinnTilganger());
  const userInfoQuery = useQuery(getUserInfo());

  if (altinnTilgangerQuery.isLoading || userInfoQuery.isLoading) {
    return <div>{t("felles.laster")}</div>;
  }

  if (altinnTilgangerQuery.isError) {
    return (
      <ErrorMessage>
        {t("felles.feil")}: {`${altinnTilgangerQuery.error}`}
      </ErrorMessage>
    );
  }

  if (userInfoQuery.isError) {
    return (
      <ErrorMessage>
        {t("felles.feil")}: {`${userInfoQuery.error}`}
      </ErrorMessage>
    );
  }

  const altinnTilganger = altinnTilgangerQuery.data;
  const userInfo = userInfoQuery.data;

  return (
    <Page.Block>
      <Heading size="large">
        {t("rollevelgerPage.hvemVilDuFylleUtSkjemaPaVegneAv")}
      </Heading>
      {userInfo && (
        <VelgRolleCard
          className="mt-4"
          description={t("rollevelgerPage.degSelv")}
          href="/skjema/arbeidstaker"
          icon={<PersonIcon aria-hidden />}
          title={userInfo.name}
        />
      )}
      {altinnTilganger?.map((altinnTilgang, index) => (
        <VelgRolleCard
          className="mt-2"
          description={`${t("rollevelgerPage.orgNr")}: ${altinnTilgang.orgnr}`}
          href="/skjema/arbeidsgiver"
          icon={<Buildings3Icon aria-hidden />}
          key={index}
          onSelectRole={() => {
            setValgtRolle(altinnTilgang);
          }}
          title={altinnTilgang.navn}
        />
      ))}
    </Page.Block>
  );
}

function VelgRolleCard({
  className,
  title,
  description,
  href,
  icon,
  onSelectRole,
}: {
  className?: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  onSelectRole?: () => void;
}) {
  return (
    <LinkCard
      className={className}
      onClick={() => {
        onSelectRole?.();
      }}
    >
      <Box
        asChild
        borderRadius="12"
        padding="space-8"
        style={{ backgroundColor: "var(--ax-bg-moderateA)" }}
      >
        <LinkCard.Icon>{icon}</LinkCard.Icon>
      </Box>
      <LinkCard.Title>
        <LinkCard.Anchor href={href}>{title}</LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>{description}</LinkCard.Description>
    </LinkCard>
  );
}
