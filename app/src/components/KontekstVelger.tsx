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
import { useRepresentasjonskontekst } from "~/hooks/useRepresentasjonskontekst.ts";
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
    await i18n.changeLanguage(code);
    // Best-effort: oppdaterer NAV-chromen og decorator-language-cookien.
    // setParams venter på dekoratørens ready-handshake og kan henge når
    // dekoratøren mangler (e2e) eller er treg — den skal aldri blokkere språkbyttet.
    void setParams({ language: code }).catch((error: unknown) => {
      globalThis.reportError(error);
    });
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
  const representasjonskontekst = useRepresentasjonskontekst();

  // Slå opp firmanavn for RADGIVER-representasjonskontekst
  const { data: organisasjonData } = useQuery({
    ...getOrganisasjonMedJuridiskEnhetQuery(
      representasjonskontekst?.radgiverOrgnr ?? "",
    ),
    enabled:
      representasjonskontekst?.representasjonstype ===
        Representasjonstype.RADGIVER && !!representasjonskontekst.radgiverOrgnr,
  });

  if (!representasjonskontekst) {
    return null;
  }

  const isDegSelv =
    representasjonskontekst.representasjonstype ===
    Representasjonstype.DEG_SELV;

  const getDisplayText = () => {
    if (isDegSelv) {
      return null;
    }
    if (
      organisasjonData &&
      representasjonskontekst.representasjonstype ===
        Representasjonstype.RADGIVER
    ) {
      return truncateText(
        organisasjonData.juridiskEnhet.navn ??
          representasjonskontekst.radgiverOrgnr ??
          "",
        23,
      );
    }
    const config =
      KONTEKST_CONFIG[
        representasjonskontekst.representasjonstype as Exclude<
          Representasjonstype,
          | Representasjonstype.DEG_SELV
          | Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT
          | Representasjonstype.RADGIVER_MED_FULLMAKT
        >
      ];
    return t(config.tekstKey);
  };

  const renderIcon = () => {
    if (isDegSelv) {
      return <PersonCircleIcon aria-hidden fontSize="2rem" />;
    }
    const config =
      KONTEKST_CONFIG[
        representasjonskontekst.representasjonstype as Exclude<
          Representasjonstype,
          | Representasjonstype.DEG_SELV
          | Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT
          | Representasjonstype.RADGIVER_MED_FULLMAKT
        >
      ];
    return <config.icon aria-hidden fontSize="2rem" />;
  };

  const displayText = getDisplayText();

  return (
    <>
      <HStack align="center" gap="space-8" paddingBlock="space-8">
        {displayText && (
          <Label
            as="span"
            aria-label={organisasjonData?.juridiskEnhet.navn}
            title={organisasjonData?.juridiskEnhet.navn}
            style={{ color: "var(--ax-text-accent-subtle)" }}
          >
            {displayText}
          </Label>
        )}
        <Button
          aria-label={t("kontekstVelger.byttKontekstAriaLabel")}
          onClick={() => setIsOpen(!isOpen)}
          ref={buttonRef}
          variant="secondary"
          size="small"
        >
          <HStack align="center" gap="space-8">
            {renderIcon()}
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
