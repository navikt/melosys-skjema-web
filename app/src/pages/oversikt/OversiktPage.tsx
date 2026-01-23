import { BodyShort, GuidePanel, Heading, VStack } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import {
  InnsendteSoknaderTabell,
  SoknadStarter,
  UtkastListe,
} from "~/pages/oversikt/components";
import {
  OpprettSoknadMedKontekstRequest,
  Representasjonstype,
} from "~/types/melosysSkjemaTypes.ts";

interface OversiktPageProps {
  kontekst: OpprettSoknadMedKontekstRequest;
}

export function OversiktPage({ kontekst }: OversiktPageProps) {
  const { t } = useTranslation();

  const getTittel = () => {
    switch (kontekst.representasjonstype) {
      case Representasjonstype.DEG_SELV: {
        return t("oversiktDegSelv.tittel");
      }
      case Representasjonstype.ARBEIDSGIVER: {
        return t("oversiktArbeidsgiver.tittel");
      }
      case Representasjonstype.RADGIVER: {
        return t("oversiktRadgiver.tittel");
      }
      case Representasjonstype.ANNEN_PERSON: {
        return t("oversiktAnnenPerson.tittel");
      }
    }
  };

  const getHerKanDu = () => {
    switch (kontekst.representasjonstype) {
      case Representasjonstype.DEG_SELV: {
        return t("oversiktDegSelv.herKanDu");
      }
      case Representasjonstype.ARBEIDSGIVER: {
        return t("oversiktArbeidsgiver.herKanDu");
      }
      case Representasjonstype.RADGIVER: {
        return t("oversiktRadgiver.herKanDu");
      }
      case Representasjonstype.ANNEN_PERSON: {
        return t("oversiktAnnenPerson.herKanDu");
      }
    }
  };

  const getInfoBullets = (): string[] => {
    switch (kontekst.representasjonstype) {
      case Representasjonstype.DEG_SELV: {
        return [
          t("oversiktDegSelv.infoBullet1"),
          t("oversiktDegSelv.infoBullet2"),
        ];
      }
      case Representasjonstype.ARBEIDSGIVER: {
        return [
          t("oversiktArbeidsgiver.infoBullet1"),
          t("oversiktArbeidsgiver.infoBullet2"),
          t("oversiktArbeidsgiver.infoBullet3"),
        ];
      }
      case Representasjonstype.RADGIVER: {
        return [
          t("oversiktRadgiver.infoBullet1"),
          t("oversiktRadgiver.infoBullet2"),
          t("oversiktRadgiver.infoBullet3"),
        ];
      }
      case Representasjonstype.ANNEN_PERSON: {
        return [
          t("oversiktAnnenPerson.infoBullet1"),
          t("oversiktAnnenPerson.infoBullet2"),
        ];
      }
    }
  };

  return (
    <VStack gap="space-24">
      <GuidePanel poster>
        <Heading level="2" size="small" spacing>
          {getTittel()}
        </Heading>
        <BodyShort size="small" spacing>
          {getHerKanDu()}
        </BodyShort>
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
