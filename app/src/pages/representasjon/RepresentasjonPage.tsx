import {
  BriefcaseIcon,
  Buildings3Icon,
  PersonGroupIcon,
  PersonIcon,
} from "@navikt/aksel-icons";
import { Box, ErrorMessage, Heading, LinkCard, Loader } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { setRepresentasjonKontekst } from "~/utils/sessionStorage.ts";

interface RepresentationOption {
  type: Representasjonstype;
  icon: ComponentType<{ "aria-hidden"?: boolean; fontSize?: string }>;
  labelKey: string;
}

interface RepresentationCardProps {
  option: RepresentationOption;
  onSelect: (type: Representasjonstype) => void;
}

type Representasjonstype =
  | "DEG_SELV"
  | "ARBEIDSGIVER"
  | "RADGIVER"
  | "ANNEN_PERSON";

function RepresentationCard({ option, onSelect }: RepresentationCardProps) {
  const { t } = useTranslation();
  const Icon = option.icon;

  return (
    <button
      className="text-left"
      onClick={() => onSelect(option.type)}
      type="button"
    >
      <LinkCard>
        <Box asChild borderRadius="medium" padding="2">
          <LinkCard.Icon>
            <Icon aria-hidden fontSize="2rem" />
          </LinkCard.Icon>
        </Box>
        <LinkCard.Title>{t(option.labelKey)}</LinkCard.Title>
      </LinkCard>
    </button>
  );
}

const REPRESENTATION_OPTIONS: RepresentationOption[] = [
  {
    type: "DEG_SELV",
    icon: PersonIcon,
    labelKey: "landingsside.degSelv",
  },
  {
    type: "ARBEIDSGIVER",
    icon: Buildings3Icon,
    labelKey: "landingsside.dinArbeidsgiver",
  },
  {
    type: "RADGIVER",
    icon: BriefcaseIcon,
    labelKey: "landingsside.enArbeidsgiverSomRadgiver",
  },
  {
    type: "ANNEN_PERSON",
    icon: PersonGroupIcon,
    labelKey: "landingsside.annenPerson",
  },
];

export function RepresentasjonPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userInfoQuery = useQuery(getUserInfo());

  const handleVelgRepresentasjon = (
    representasjonstype: Representasjonstype,
  ) => {
    setRepresentasjonKontekst({
      representasjonstype,
      harFullmakt: false,
    });

    // RADGIVER må velge firma først, andre går direkte til oversikt
    if (representasjonstype === "RADGIVER") {
      void navigate({ to: "/representasjon/velg-radgiverfirma" });
    } else {
      void navigate({ to: "/oversikt" });
    }
  };

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

  return (
    <>
      <Heading className="mt-4" level="1" size="large">
        {t("landingsside.hvemVilDuBrukeNavPaVegneAv")}
      </Heading>

      <div className="flex flex-col gap-4">
        {REPRESENTATION_OPTIONS.map((option) => (
          <RepresentationCard
            key={option.type}
            onSelect={handleVelgRepresentasjon}
            option={option}
          />
        ))}
      </div>
    </>
  );
}
