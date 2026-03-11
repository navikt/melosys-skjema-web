import {
  BriefcaseIcon,
  ChevronDownIcon,
  GlobeIcon,
  HandshakeIcon,
  PersonCircleIcon,
  PersonGroupIcon,
} from "@navikt/aksel-icons";
import { Button, HStack, Label, Popover } from "@navikt/ds-react";
import { setParams } from "@navikt/nav-dekoratoren-moduler";
import { useQuery } from "@tanstack/react-query";
import type { ComponentType } from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { RepresentasjonVelger } from "~/components/RepresentasjonVelger.tsx";
import { useKontekst } from "~/hooks/useKontekst.ts";
import { getOrganisasjonMedJuridiskEnhetQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import { type Language, SUPPORTED_LANGUAGES } from "~/utils/languages.ts";
import { truncateText } from "~/utils/truncateText.ts";

interface KontekstConfig {
  icon: ComponentType<{ "aria-hidden"?: boolean; fontSize?: string }>;
  tekstKey: string;
}

function MaalformValg() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = async (code: Language["code"]) => {
    await setParams({ language: code });
    await i18n.changeLanguage(code);
  };

  return (
    <HStack align="center" gap="space-8">
      <GlobeIcon aria-hidden fontSize="1.5rem" />
      {SUPPORTED_LANGUAGES.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => handleChangeLanguage(lang.code)}
          size="small"
          variant={i18n.language === lang.code ? "primary" : "tertiary"}
        >
          {lang.label}
        </Button>
      ))}
    </HStack>
  );
}

const KONTEKST_CONFIG: Record<
  Exclude<
    Representasjonstype,
    | Representasjonstype.DEG_SELV
    | Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT
    | Representasjonstype.RADGIVER_MED_FULLMAKT
  >,
  KontekstConfig
> = {
  [Representasjonstype.ARBEIDSGIVER]: {
    icon: BriefcaseIcon,
    tekstKey: "kontekstVelger.arbeidsgiver",
  },
  [Representasjonstype.RADGIVER]: {
    icon: HandshakeIcon,
    tekstKey: "kontekstVelger.radgiver",
  },
  [Representasjonstype.ANNEN_PERSON]: {
    icon: PersonGroupIcon,
    tekstKey: "kontekstVelger.annenPerson",
  },
};

export function KontekstVelger() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const kontekst = useKontekst();

  // Slå opp firmanavn for RADGIVER-kontekst
  const { data: organisasjonData } = useQuery({
    ...getOrganisasjonMedJuridiskEnhetQuery(kontekst?.radgiverOrgnr ?? ""),
    enabled:
      kontekst?.representasjonstype === Representasjonstype.RADGIVER &&
      !!kontekst.radgiverOrgnr,
  });

  if (!kontekst) {
    return null;
  }

  const isDegSelv =
    kontekst.representasjonstype === Representasjonstype.DEG_SELV;

  const getDisplayText = () => {
    if (isDegSelv) {
      return null;
    }
    const config =
      KONTEKST_CONFIG[
        kontekst.representasjonstype as Exclude<
          Representasjonstype,
          | Representasjonstype.DEG_SELV
          | Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT
          | Representasjonstype.RADGIVER_MED_FULLMAKT
        >
      ];
    if (
      kontekst.representasjonstype === Representasjonstype.RADGIVER &&
      organisasjonData
    ) {
      return truncateText(
        organisasjonData.juridiskEnhet.navn ?? kontekst.radgiverOrgnr ?? "",
        23,
      );
    }
    return t(config.tekstKey);
  };

  const getIcon = () => {
    if (isDegSelv) {
      return PersonCircleIcon;
    }
    return KONTEKST_CONFIG[
      kontekst.representasjonstype as Exclude<
        Representasjonstype,
        | Representasjonstype.DEG_SELV
        | Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT
        | Representasjonstype.RADGIVER_MED_FULLMAKT
      >
    ].icon;
  };

  const displayText = getDisplayText();
  const Icon = getIcon();

  return (
    <>
      <HStack align="center" gap="space-8">
        {displayText && (
          <Label as="span" style={{ color: "var(--ax-border-accent)" }}>
            {displayText}
          </Label>
        )}
        <Button
          aria-label={t("kontekstVelger.byttKontekstAriaLabel")}
          onClick={() => setIsOpen(!isOpen)}
          ref={buttonRef}
          variant="secondary"
        >
          <HStack align="center" gap="space-8">
            {Icon && <Icon aria-hidden fontSize="2rem" />}
            <ChevronDownIcon aria-hidden fontSize="1.5rem" />
          </HStack>
        </Button>
      </HStack>
      <Popover
        anchorEl={buttonRef.current}
        onClose={() => setIsOpen(false)}
        open={isOpen}
        placement="bottom-end"
      >
        <Popover.Content>
          <RepresentasjonVelger
            onVelg={() => setIsOpen(false)}
            visOverskrift={false}
          />
          <hr className="my-4 border-border-subtle" />
          <MaalformValg />
        </Popover.Content>
      </Popover>
    </>
  );
}
