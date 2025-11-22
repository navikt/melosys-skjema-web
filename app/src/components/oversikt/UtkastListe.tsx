import { NotePencilDashIcon } from "@navikt/aksel-icons";
import { BodyShort, ExpansionCard, Heading, HStack } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import type { RepresentasjonskontekstDto } from "~/types/representasjon";

interface UtkastListeProps {
  kontekst: RepresentasjonskontekstDto;
}

/**
 * Utkast/påbegynte søknader komponent.
 * TODO: MELOSYS-7724 vil implementere:
 * - Henting av utkast fra backend
 * - Filtrering basert på kontekst
 * - Navigering til fortsett søknad
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function UtkastListe(_props: UtkastListeProps) {
  const { t } = useTranslation();

  return (
    <ExpansionCard aria-label={t("oversiktFelles.utkastTittel")} size="small">
      <ExpansionCard.Header className="rounded-small">
        <HStack align="center" gap="2">
          <NotePencilDashIcon
            aria-hidden
            className="text-surface-action"
            fontSize="2rem"
          />
          <Heading level="3" size="small">
            {t("oversiktFelles.utkastTittel")}
          </Heading>
        </HStack>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <BodyShort>{t("oversiktFelles.utkastBeskrivelse")}</BodyShort>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
