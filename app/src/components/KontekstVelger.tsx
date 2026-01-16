import {
  BriefcaseIcon,
  ChevronDownIcon,
  GlobeIcon,
  HandshakeIcon,
  PersonCircleIcon,
  PersonGroupIcon,
} from "@navikt/aksel-icons";
import { Button, HStack, Popover } from "@navikt/ds-react";
import { DecoratorLocale, setParams } from "@navikt/nav-dekoratoren-moduler";
import { useLocation } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { RepresentasjonVelger } from "~/components/RepresentasjonVelger.tsx";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage.ts";

type Representasjonstype =
  | "DEG_SELV"
  | "ARBEIDSGIVER"
  | "RADGIVER"
  | "ANNEN_PERSON";

interface KontekstConfig {
  icon: ComponentType<{ "aria-hidden"?: boolean; fontSize?: string }>;
  tekstKey: string;
}

const LANGUAGES: { code: DecoratorLocale; label: string }[] = [
  { code: "nb", label: "Norsk" },
  { code: "en", label: "English" },
];

function MaalformValg() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = async (code: DecoratorLocale) => {
    await setParams({ language: code });
    await i18n.changeLanguage(code);
  };

  return (
    <HStack align="center" gap="2">
      <GlobeIcon aria-hidden fontSize="1.5rem" />
      {LANGUAGES.map((lang) => (
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
  Exclude<Representasjonstype, "DEG_SELV">,
  KontekstConfig
> = {
  ARBEIDSGIVER: {
    icon: BriefcaseIcon,
    tekstKey: "kontekstVelger.arbeidsgiver",
  },
  RADGIVER: {
    icon: HandshakeIcon,
    tekstKey: "kontekstVelger.radgiver",
  },
  ANNEN_PERSON: {
    icon: PersonGroupIcon,
    tekstKey: "kontekstVelger.annenPerson",
  },
};

export function KontekstVelger() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Re-read kontekst on every render (triggered by location changes)
  const kontekst = getRepresentasjonKontekst();

  // Force re-render when location changes by using it
  void location.pathname;

  if (!kontekst) {
    return null;
  }

  const isDegSelv = kontekst.representasjonstype === "DEG_SELV";

  const getDisplayText = () => {
    if (isDegSelv) {
      return null;
    }
    const config =
      KONTEKST_CONFIG[
        kontekst.representasjonstype as Exclude<Representasjonstype, "DEG_SELV">
      ];
    if (kontekst.representasjonstype === "RADGIVER" && kontekst.radgiverfirma) {
      return kontekst.radgiverfirma.navn;
    }
    return t(config.tekstKey);
  };

  const getIcon = () => {
    if (isDegSelv) {
      return PersonCircleIcon;
    }
    return KONTEKST_CONFIG[
      kontekst.representasjonstype as Exclude<Representasjonstype, "DEG_SELV">
    ].icon;
  };

  const displayText = getDisplayText();
  const Icon = getIcon();

  return (
    <>
      <HStack align="center" gap="2">
        {displayText && (
          <span className="text-xl font-semibold" style={{ color: "#0067C5" }}>
            {displayText}
          </span>
        )}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          ref={buttonRef}
          variant="secondary"
        >
          <HStack align="center" gap="2">
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
