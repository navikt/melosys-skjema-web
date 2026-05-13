import { FormSummary, HStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { StegIkon } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import {
  ARBEIDSGIVER_IKON,
  ARBEIDSTAKER_IKON,
} from "~/pages/skjema/stegRekkefølge.ts";
import type { UtsendtArbeidstakerSkjemaDto } from "~/types/melosysSkjemaTypes.ts";

type HeadingLevel = "2" | "3" | "4" | "5" | "6";

interface ArbeidstakerOgArbeidsgiverOppsummeringProps {
  skjema: UtsendtArbeidstakerSkjemaDto;
  /** Heading-nivå for boks-headingene. Velges ut fra hierarkiet rundt komponenten. */
  headingLevel?: HeadingLevel;
}

export function ArbeidstakerOgArbeidsgiverOppsummering({
  skjema,
  headingLevel = "3",
}: ArbeidstakerOgArbeidsgiverOppsummeringProps) {
  const { t } = useTranslation();

  return (
    <>
      <Oppsummeringsboks
        ikon={ARBEIDSTAKER_IKON}
        tittel={t("oversiktFelles.arbeidstakerTittel")}
        headingLevel={headingLevel}
      >
        <FormSummary.Answer>
          <FormSummary.Label>{t("felles.navn")}</FormSummary.Label>
          <FormSummary.Value>
            {skjema.metadata.arbeidstakerNavn}
          </FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("oversiktFelles.arbeidstakerFnrLabel")}
          </FormSummary.Label>
          <FormSummary.Value>{skjema.fnr}</FormSummary.Value>
        </FormSummary.Answer>
      </Oppsummeringsboks>

      <Oppsummeringsboks
        ikon={ARBEIDSGIVER_IKON}
        tittel={t("oversiktFelles.arbeidsgiverTittel")}
        headingLevel={headingLevel}
      >
        <FormSummary.Answer>
          <FormSummary.Label>{t("felles.virksomhetsnavn")}</FormSummary.Label>
          <FormSummary.Value>
            {skjema.metadata.arbeidsgiverNavn}
          </FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("felles.organisasjonsnummer")}
          </FormSummary.Label>
          <FormSummary.Value>{skjema.orgnr}</FormSummary.Value>
        </FormSummary.Answer>
      </Oppsummeringsboks>
    </>
  );
}

function Oppsummeringsboks({
  ikon,
  tittel,
  headingLevel,
  children,
}: {
  ikon: StegIkon;
  tittel: string;
  headingLevel: HeadingLevel;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level={headingLevel}>
          <HStack as="span" align="center" gap="space-8">
            {tittel}
            <ikon.icon
              aria-label={t(ikon.ariaLabel)}
              role="img"
              fontSize="1.5rem"
            />
          </HStack>
        </FormSummary.Heading>
      </FormSummary.Header>
      <FormSummary.Answers>{children}</FormSummary.Answers>
    </FormSummary>
  );
}
