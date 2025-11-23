import {
  BriefcaseIcon,
  Buildings3Icon,
  PersonGroupIcon,
  PersonIcon,
} from "@navikt/aksel-icons";
import {
  Box,
  Button,
  ErrorMessage,
  Heading,
  LinkCard,
  Loader,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

import { getUserInfo } from "~/httpClients/dekoratorenClient";
import type { RepresentasjonsType } from "~/types/representasjon";
import { setRepresentasjonKontekst } from "~/utils/sessionStorage";

function getFirstName(fullName: string | undefined): string {
  if (!fullName) return "";
  return fullName.split(" ")[0] ?? fullName;
}

interface RepresentationOption {
  type: RepresentasjonsType;
  icon: ComponentType<{ "aria-hidden"?: boolean; fontSize?: string }>;
  labelKey: string;
}

interface RepresentationCardProps {
  option: RepresentationOption;
  onSelect: (type: RepresentasjonsType) => void;
}

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

export function LandingssidePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userInfoQuery = useQuery(getUserInfo());

  const handleVelgRepresentasjon = (type: RepresentasjonsType) => {
    setRepresentasjonKontekst({
      type,
      harFullmakt: false,
    });

    switch (type) {
      case "DEG_SELV":
      case "ARBEIDSGIVER":
      case "ANNEN_PERSON": {
        navigate({ to: "/oversikt" });
        break;
      }
      case "RADGIVER": {
        navigate({ to: "/representasjon/radgiverfirma" });
        break;
      }
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

  const userInfo = userInfoQuery.data;
  const fornavn = getFirstName(userInfo.name);

  return (
    <>
      <Heading className="mt-4" level="1" size="large">
        {t("landingsside.hei")}, {fornavn}
      </Heading>

      <Heading level="2" size="large">
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

      <div className="mt-8">
        <Button
          onClick={() => {
            globalThis.location.href =
              import.meta.env.VITE_NAV_URL || "https://www.nav.no";
          }}
          variant="secondary"
        >
          {t("landingsside.avbryt")}
        </Button>
      </div>
    </>
  );
}
