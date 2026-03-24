import {
  Alert,
  BodyShort,
  GuidePanel,
  Heading,
  Loader,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { getOrganisasjonMedJuridiskEnhetQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  InnsendteSoknaderTabell,
  SoknadStarter,
  UtkastListe,
} from "~/pages/oversikt/components";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";
import { ValideringError } from "~/utils/valideringUtils.ts";

interface OversiktPageProps {
  representasjonskontekst: Representasjonskontekst;
}

export function OversiktPage({ representasjonskontekst }: OversiktPageProps) {
  const { t } = useTranslation();

  const isRadgiver =
    representasjonskontekst.representasjonstype ===
    Representasjonstype.RADGIVER;

  const { isLoading, isError, error } = useQuery({
    ...getOrganisasjonMedJuridiskEnhetQuery(
      representasjonskontekst.radgiverOrgnr ?? "",
    ),
    enabled: isRadgiver && !!representasjonskontekst.radgiverOrgnr,
  });

  if (isRadgiver && isError) {
    if (error instanceof ValideringError) {
      return <Navigate to="/representasjon/velg-radgiverfirma" />;
    }
    return <Alert variant="error">{t("generellValidering.feilVedSok")}</Alert>;
  }

  if (isRadgiver && isLoading) {
    return <Loader size="medium" title={t("felles.laster")} />;
  }

  const getTittel = () => {
    switch (representasjonskontekst.representasjonstype) {
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
    switch (representasjonskontekst.representasjonstype) {
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
    switch (representasjonskontekst.representasjonstype) {
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
      <GuidePanel
        className="w-full [&>.aksel-guide-panel\_\_content]:w-full"
        poster
      >
        <Heading level="2" size="small" spacing>
          {getTittel()}
        </Heading>
        <BodyShort size="small" spacing>
          {getHerKanDu()}
        </BodyShort>
        <ul className="list-disc pl-6 space-y-1">
          {getInfoBullets().map((bullet) => (
            <li key={bullet}>
              <BodyShort size="small">{bullet}</BodyShort>
            </li>
          ))}
        </ul>
      </GuidePanel>
      <UtkastListe representasjonskontekst={representasjonskontekst} />
      <SoknadStarter representasjonskontekst={representasjonskontekst} />
      <InnsendteSoknaderTabell
        representasjonskontekst={representasjonskontekst}
      />
    </VStack>
  );
}
