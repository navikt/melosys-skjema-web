import { Buildings3Icon, PersonIcon } from "@navikt/aksel-icons";
import { Box, Heading, LinkCard, Page } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";

import { listAltinnTilganger } from "~/api/queries.ts";

const VALGT_ROLLE_KEY = "valgtRolle";

export function RollevelgerPage() {
  const altinnTilgangerQuery = useQuery(listAltinnTilganger());

  if (altinnTilgangerQuery.isLoading) {
    return <div>Laster...</div>;
  }

  if (altinnTilgangerQuery.isError) {
    return <div>Det oppstod en feil: {`${altinnTilgangerQuery.error}`}</div>;
  }

  const altinnTilganger = altinnTilgangerQuery.data;

  return (
    <Page.Block>
      <Heading size="large">Hvem vil du å fylle ut skjema på vegne av?</Heading>
      <VelgRolleCard
        className="mt-4"
        description="Deg selv"
        href="/arbeidstaker"
        icon={<PersonIcon aria-hidden />}
        title="Navn Navnesen"
      />
      {altinnTilganger?.map((altinnTilgang, index) => (
        <VelgRolleCard
          className="mt-2"
          description={`Org.nr.: ${altinnTilgang.orgnr}`}
          href="/arbeidsgiver"
          icon={<Buildings3Icon aria-hidden />}
          key={index}
          onSelectRole={() => {
            sessionStorage.setItem(
              VALGT_ROLLE_KEY,
              JSON.stringify(altinnTilgang),
            );
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
