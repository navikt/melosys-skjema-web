import {
  BriefcaseIcon,
  ChevronRightIcon,
  HandshakeIcon,
  PersonCircleIcon,
  PersonGroupIcon,
} from "@navikt/aksel-icons";
import {
  BodyShort,
  Heading,
  HStack,
  LinkCard,
  Tag,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

import { MOTPART_CTA } from "~/featuretoggle/toggleNavn.ts";
import { useFeatureToggle } from "~/featuretoggle/useFeatureToggle.ts";
import { getVentendeMotpartSoknaderQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";

interface RepresentationOption {
  type: Representasjonskontekst["representasjonstype"];
  icon: ComponentType<{
    "aria-hidden"?: boolean;
    fontSize?: string;
    className?: string;
  }>;
  labelKey: string;
  descriptionKey?: string;
}

interface RepresentationCardProperties {
  option: RepresentationOption;
  onSelect: (type: Representasjonskontekst["representasjonstype"]) => void;
  badge?: string;
}

function RepresentationCard({
  option,
  onSelect,
  badge,
}: RepresentationCardProperties) {
  const { t } = useTranslation();
  const Icon = option.icon;

  return (
    <button
      className="w-full text-left border border-ax-border-neutral-subtle rounded px-4 py-4 cursor-pointer transition-colors hover:bg-ax-bg-accent-soft hover:border-ax-border-accent"
      onClick={() => onSelect(option.type)}
      type="button"
    >
      <HStack align="center" gap="space-16" justify="space-between">
        <HStack align="center" gap="space-16">
          <Icon
            aria-hidden
            className="text-ax-text-accent"
            fontSize="1.75rem"
          />
          <div>
            <HStack align="center" gap="space-8">
              <BodyShort weight="semibold">{t(option.labelKey)}</BodyShort>
              {badge && (
                <Tag size="small" variant="info">
                  {badge}
                </Tag>
              )}
            </HStack>
            {option.descriptionKey && (
              <BodyShort size="small">{t(option.descriptionKey)}</BodyShort>
            )}
          </div>
        </HStack>
        <ChevronRightIcon
          aria-hidden
          className="text-ax-text-accent"
          fontSize="1.5rem"
        />
      </HStack>
    </button>
  );
}

function RepresentasjonLenkekort({
  option,
  onVelg,
  badge,
}: {
  option: RepresentationOption;
  onVelg?: () => void;
  badge?: string;
}) {
  const { t } = useTranslation();
  const Icon = option.icon;
  const tittel = t(option.labelKey);

  return (
    <LinkCard arrowPosition="center" data-color="accent">
      <LinkCard.Icon>
        <Icon aria-hidden fontSize="2rem" />
      </LinkCard.Icon>
      <LinkCard.Title as="h2">
        <LinkCard.Anchor asChild>
          {option.type === Representasjonstype.RADGIVER ? (
            <Link onClick={onVelg} to="/representasjon/velg-radgiverfirma">
              {tittel}
            </Link>
          ) : (
            <Link
              onClick={onVelg}
              search={{ representasjonstype: option.type }}
              to="/oversikt"
            >
              {tittel}
            </Link>
          )}
        </LinkCard.Anchor>
      </LinkCard.Title>
      {option.descriptionKey && (
        <LinkCard.Description>{t(option.descriptionKey)}</LinkCard.Description>
      )}
      {badge && (
        <LinkCard.Footer>
          <Tag size="small" variant="info">
            {badge}
          </Tag>
        </LinkCard.Footer>
      )}
    </LinkCard>
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
    descriptionKey: "landingsside.dinArbeidsgiverBeskrivelse",
  },
  {
    type: Representasjonstype.RADGIVER,
    icon: HandshakeIcon,
    labelKey: "landingsside.enArbeidsgiverSomRadgiver",
    descriptionKey: "landingsside.enArbeidsgiverSomRadgiverBeskrivelse",
  },
  {
    type: Representasjonstype.ANNEN_PERSON,
    icon: PersonGroupIcon,
    labelKey: "landingsside.annenPerson",
    descriptionKey: "landingsside.annenPersonBeskrivelse",
  },
];

interface RepresentasjonVelgerProperties {
  onVelg?: () => void;
  /**
  "header" gir knapper uten overskrift, for menyen i headeren.
  */
  variant?: "side" | "header";
}

export function RepresentasjonVelger({
  onVelg,
  variant = "side",
}: RepresentasjonVelgerProperties) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const motpartCtaAktiv = useFeatureToggle(MOTPART_CTA) ?? false;
  const { data: ventendeMotpartSoknader } = useQuery({
    ...getVentendeMotpartSoknaderQuery(),
    enabled: motpartCtaAktiv,
  });
  const harVentendeMotpartSoknad =
    (ventendeMotpartSoknader?.soknader.length ?? 0) > 0;

  const handleVelgRepresentasjon = (
    representasjonstype: Representasjonskontekst["representasjonstype"],
  ) => {
    onVelg?.();

    if (representasjonstype === Representasjonstype.RADGIVER) {
      void navigate({
        to: "/representasjon/velg-radgiverfirma",
      });
    } else {
      void navigate({
        to: "/oversikt",
        search: { representasjonstype },
      });
    }
  };

  const badgeFor = (option: RepresentationOption) =>
    harVentendeMotpartSoknad && option.type === Representasjonstype.DEG_SELV
      ? t("landingsside.soknadVenterPaaDeg")
      : undefined;

  if (variant === "header") {
    return (
      <div className="flex flex-col gap-2">
        {REPRESENTATION_OPTIONS.map((option) => (
          <RepresentationCard
            badge={badgeFor(option)}
            key={option.type}
            onSelect={handleVelgRepresentasjon}
            option={option}
          />
        ))}
      </div>
    );
  }

  return (
    <VStack gap="space-24">
      <Heading className="mt-4" level="1" size="small">
        {t("landingsside.hvemVilDuBrukeNavPaVegneAv")}
      </Heading>

      <VStack gap="space-24">
        {REPRESENTATION_OPTIONS.map((option) => (
          <RepresentasjonLenkekort
            badge={badgeFor(option)}
            key={option.type}
            onVelg={onVelg}
            option={option}
          />
        ))}
      </VStack>
    </VStack>
  );
}
