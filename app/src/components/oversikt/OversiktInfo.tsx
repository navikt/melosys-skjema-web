import { BodyShort, GuidePanel, Heading } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import type { RepresentasjonskontekstDto } from "~/types/representasjon";

interface OversiktInfoProps {
  kontekst: RepresentasjonskontekstDto;
}

export function OversiktInfo({ kontekst }: OversiktInfoProps) {
  const { t } = useTranslation();

  const getTittel = () => {
    switch (kontekst.type) {
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
    switch (kontekst.type) {
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
  );
}
