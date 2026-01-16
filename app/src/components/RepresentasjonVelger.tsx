import {
  BriefcaseIcon,
  ChevronRightIcon,
  HandshakeIcon,
  PersonCircleIcon,
  PersonGroupIcon,
} from "@navikt/aksel-icons";
import { BodyShort, Heading, HStack } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import {
  clearRepresentasjonKontekst,
  setRepresentasjonKontekst,
} from "~/utils/sessionStorage.ts";

interface RepresentationOption {
  type: Representasjonstype;
  icon: ComponentType<{
    "aria-hidden"?: boolean;
    fontSize?: string;
    className?: string;
  }>;
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
      className="w-full text-left border border-border-subtle rounded px-4 py-4 hover:bg-surface-action-subtle transition-colors"
      onClick={() => onSelect(option.type)}
      type="button"
    >
      <HStack align="center" gap="4" justify="space-between">
        <HStack align="center" gap="4">
          <Icon aria-hidden className="text-icon-action" fontSize="1.75rem" />
          <BodyShort weight="semibold">{t(option.labelKey)}</BodyShort>
        </HStack>
        <ChevronRightIcon
          aria-hidden
          className="text-icon-action"
          fontSize="1.5rem"
        />
      </HStack>
    </button>
  );
}

const REPRESENTATION_OPTIONS: RepresentationOption[] = [
  {
    type: Representasjonstype.DEG_SELV,
    icon: PersonCircleIcon,
    labelKey: "landingsside.degSelv",
  },
  {
    type: Representasjonstype.ARBEIDSGIVER,
    icon: BriefcaseIcon,
    labelKey: "landingsside.dinArbeidsgiver",
  },
  {
    type: Representasjonstype.RADGIVER,
    icon: HandshakeIcon,
    labelKey: "landingsside.enArbeidsgiverSomRadgiver",
  },
  {
    type: Representasjonstype.ANNEN_PERSON,
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

    if (representasjonstype === Representasjonstype.RADGIVER) {
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

      <div className="flex flex-col gap-2">
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
