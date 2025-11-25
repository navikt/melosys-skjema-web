import { BodyShort, GuidePanel, Heading, VStack } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { KontekstBanner } from "~/components/KontekstBanner";
import {
  InnsendteSoknaderTabell,
  SoknadStarter,
  UtkastListe,
} from "~/pages/representasjon/components";
import { OpprettSoknadMedKontekstRequest } from "~/types/melosysSkjemaTypes";

interface OversiktPageProps {
  kontekst: OpprettSoknadMedKontekstRequest;
}

export function OversiktPage({ kontekst }: OversiktPageProps) {
  const { t } = useTranslation();

  const getTittel = () => {
    switch (kontekst.representasjonstype) {
      case "DEG_SELV": {
        return t("oversiktDegSelv.tittel");
      }
      case "ARBEIDSGIVER": {
        return t("oversiktArbeidsgiver.tittel");
      }
      case "RADGIVER": {
        return t("oversiktRadgiver.tittel");
      }
      case "ANNEN_PERSON": {
        return t("oversiktAnnenPerson.tittel");
      }
    }
  };

  const getInfoBullets = (): string[] => {
    switch (kontekst.representasjonstype) {
      case "DEG_SELV": {
        return [
          t("oversiktDegSelv.infoBullet1"),
          t("oversiktDegSelv.infoBullet2"),
        ];
      }
      case "ARBEIDSGIVER": {
        return [
          t("oversiktArbeidsgiver.infoBullet1"),
          t("oversiktArbeidsgiver.infoBullet2"),
          t("oversiktArbeidsgiver.infoBullet3"),
          t("oversiktArbeidsgiver.infoBullet4"),
        ];
      }
      case "RADGIVER": {
        return [
          t("oversiktRadgiver.infoBullet1"),
          t("oversiktRadgiver.infoBullet2"),
          t("oversiktRadgiver.infoBullet3"),
          t("oversiktRadgiver.infoBullet4"),
        ];
      }
      case "ANNEN_PERSON": {
        return [
          t("oversiktAnnenPerson.infoBullet1"),
          t("oversiktAnnenPerson.infoBullet2"),
        ];
      }
    }
  };

  return (
    <VStack gap="6">
      <KontekstBanner kontekst={kontekst} />

      <GuidePanel poster>
        <Heading level="2" size="small" spacing>
          {getTittel()}
        </Heading>
        <ul className="list-disc pl-6 space-y-1">
          {getInfoBullets().map((bullet, index) => (
            <li key={index}>
              <BodyShort size="small">{bullet}</BodyShort>
            </li>
          ))}
        </ul>
      </GuidePanel>

      <UtkastListe kontekst={kontekst} />
      <SoknadStarter kontekst={kontekst} />
      <InnsendteSoknaderTabell kontekst={kontekst} />
    </VStack>
  );
}
