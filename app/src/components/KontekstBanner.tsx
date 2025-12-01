import {
  BriefcaseIcon,
  Buildings3Icon,
  PersonGroupIcon,
  PersonIcon,
} from "@navikt/aksel-icons";
import { BodyShort, Box, Button, HStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

import { getUserInfo } from "~/httpClients/dekoratorenClient";
import { OpprettSoknadMedKontekstRequest } from "~/types/melosysSkjemaTypes.ts";
import { clearRepresentasjonKontekst } from "~/utils/sessionStorage";

type Representasjonstype =
  | "DEG_SELV"
  | "ARBEIDSGIVER"
  | "RADGIVER"
  | "ANNEN_PERSON";

interface KontekstBannerProps {
  kontekst: OpprettSoknadMedKontekstRequest;
}

interface KontekstConfig {
  icon: ComponentType<{ "aria-hidden"?: boolean; fontSize?: string }>;
  tittelKey: string;
  getDetaljer: (
    kontekst: OpprettSoknadMedKontekstRequest,
    userName: string | undefined,
    t: (key: string) => string,
  ) => string;
}

const KONTEKST_CONFIG: Record<Representasjonstype, KontekstConfig> = {
  DEG_SELV: {
    icon: PersonIcon,
    tittelKey: "kontekstBanner.minSide",
    getDetaljer: (_, userName) => userName ?? "",
  },
  ARBEIDSGIVER: {
    icon: Buildings3Icon,
    tittelKey: "kontekstBanner.minSideArbeidsgiver",
    getDetaljer: (kontekst, _, t) =>
      kontekst.arbeidsgiver
        ? `${kontekst.arbeidsgiver.navn} Org.nr. ${kontekst.arbeidsgiver.orgnr}`
        : t("kontekstBanner.ingenArbeidsgiverValgt"),
  },
  RADGIVER: {
    icon: BriefcaseIcon,
    tittelKey: "kontekstBanner.minSideRadgiver",
    getDetaljer: (kontekst, _, t) =>
      kontekst.radgiverfirma
        ? `${kontekst.radgiverfirma.navn} Org.nr. ${kontekst.radgiverfirma.orgnr}`
        : t("kontekstBanner.ingenRadgiverValgt"),
  },
  ANNEN_PERSON: {
    icon: PersonGroupIcon,
    tittelKey: "kontekstBanner.minSideAnnenPerson",
    getDetaljer: (kontekst, _, t) =>
      // TODO: Hva skal gjøres her? Her var det brukt en egendefinert type med feltet- navn, men typen apiet leverer har kun et nullable "etternavn"-felt.
      kontekst.arbeidstaker?.etternavn ?? t("kontekstBanner.ingenPersonValgt"),
  },
};

export function KontekstBanner({ kontekst }: KontekstBannerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userInfoQuery = useQuery(getUserInfo());

  const handleByttKontekst = () => {
    clearRepresentasjonKontekst();
    navigate({ to: "/" });
  };

  const config = KONTEKST_CONFIG[kontekst.representasjonstype];
  const Icon = config.icon;

  return (
    <Box
      borderColor="border-subtle"
      borderRadius="medium"
      borderWidth="1"
      padding="4"
    >
      <HStack align="center" justify="space-between">
        <HStack align="center" gap="4">
          <Box borderRadius="medium" padding="2">
            <Icon aria-hidden fontSize="1.5rem" />
          </Box>
          <div>
            <BodyShort className="font-semibold" size="small">
              {t(config.tittelKey)}
            </BodyShort>
            <BodyShort size="small">
              {config.getDetaljer(kontekst, userInfoQuery.data?.name, t)}
            </BodyShort>
          </div>
        </HStack>
        <Button
          aria-label={t("kontekstBanner.byttKontekstAriaLabel")}
          onClick={handleByttKontekst}
          size="small"
          variant="secondary"
        >
          {t("kontekstBanner.byttKontekst")}
        </Button>
      </HStack>
    </Box>
  );
}
