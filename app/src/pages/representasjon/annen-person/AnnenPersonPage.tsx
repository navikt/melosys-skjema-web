import { BodyShort, GuidePanel, Heading, VStack } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { KontekstBanner } from "~/components/KontekstBanner.tsx";
import {
  InnsendteSoknaderTabell,
  SoknadStarter,
  UtkastListe,
} from "~/pages/representasjon/components";
import { OpprettSoknadMedKontekstRequest } from "~/types/melosysSkjemaTypes.ts";

interface AnnenPersonPageProps {
  kontekst: OpprettSoknadMedKontekstRequest;
}

export function AnnenPersonPage({ kontekst }: AnnenPersonPageProps) {
  const { t } = useTranslation();

  return (
    <VStack gap="6">
      <KontekstBanner kontekst={kontekst} />

      <GuidePanel poster>
        <Heading level="2" size="small" spacing>
          {t("oversiktAnnenPerson.tittel")}
        </Heading>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <BodyShort size="small">
              {t("oversiktAnnenPerson.infoBullet1")}
            </BodyShort>
          </li>
          <li>
            <BodyShort size="small">
              {t("oversiktAnnenPerson.infoBullet2")}
            </BodyShort>
          </li>
        </ul>
      </GuidePanel>

      <UtkastListe kontekst={kontekst} />
      <SoknadStarter kontekst={kontekst} />
      <InnsendteSoknaderTabell kontekst={kontekst} />
    </VStack>
  );
}
