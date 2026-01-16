import {
  BriefcaseIcon,
  HandshakeIcon,
  PersonGroupIcon,
  PersonIcon,
} from "@navikt/aksel-icons";
import { Box, Heading, LinkCard } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

import {
  clearRepresentasjonKontekst,
  setRepresentasjonKontekst,
} from "~/utils/sessionStorage.ts";

export type Representasjonstype =
  | "DEG_SELV"
  | "ARBEIDSGIVER"
  | "RADGIVER"
  | "ANNEN_PERSON";

interface RepresentationOption {
  type: Representasjonstype;
  icon: ComponentType<{ "aria-hidden"?: boolean; fontSize?: string }>;
  labelKey: string;
}

interface RepresentationCardProps {
  option: RepresentationOption;
  onSelect: (type: Representasjonstype) => void;
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
    icon: BriefcaseIcon,
    labelKey: "landingsside.dinArbeidsgiver",
  },
  {
    type: "RADGIVER",
    icon: HandshakeIcon,
    labelKey: "landingsside.enArbeidsgiverSomRadgiver",
  },
  {
    type: "ANNEN_PERSON",
    icon: PersonGroupIcon,
    labelKey: "landingsside.annenPerson",
  },
];

interface RepresentasjonVelgerProps {
  onVelg?: () => void;
  visOverskrift?: boolean;
}

export function RepresentasjonVelger({
  onVelg,
  visOverskrift = true,
}: RepresentasjonVelgerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleVelgRepresentasjon = (
    representasjonstype: Representasjonstype,
  ) => {
    clearRepresentasjonKontekst();
    setRepresentasjonKontekst({
      representasjonstype,
      harFullmakt: false,
    });

    onVelg?.();

    if (representasjonstype === "RADGIVER") {
      void navigate({ to: "/representasjon/velg-radgiverfirma" });
    } else {
      void navigate({ to: "/oversikt" });
    }
  };

  return (
    <>
      {visOverskrift && (
        <Heading className="mt-4" level="1" size="large">
          {t("landingsside.hvemVilDuBrukeNavPaVegneAv")}
        </Heading>
      )}

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
