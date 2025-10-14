import { PaperplaneIcon } from "@navikt/aksel-icons";
import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { stepKey as arbeidsgiverensVirksomhetINorgeStepKey } from "./ArbeidsgiverensVirksomhetINorgeSteg.tsx";
import { stepKey as arbeidsgiverStepKey } from "./ArbeidsgiverSteg.tsx";
import { ArbeidsgiverStegLoader } from "./components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "./types.ts";

const oppsummeringStepKey = "oppsummering";

function booleanToJaNei(value: boolean, t: (key: string) => string): string {
  return value ? t("felles.ja") : t("felles.nei");
}

interface ArbeidsgiverOppsummeringStegProps {
  id: string;
}

export function ArbeidsgiverOppsummeringSteg({
  id,
}: ArbeidsgiverOppsummeringStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <ArbeidsgiverOppsummeringStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}

function ArbeidsgiverOppsummeringStegContent({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const renderStepSummary = (stepKey: string) => {
    switch (stepKey) {
      case arbeidsgiverStepKey: {
        return <ArbeidsgiverenStegSummary key={stepKey} skjema={skjema} />;
      }
      case arbeidsgiverensVirksomhetINorgeStepKey: {
        return (
          <ArbeidsgiverensVirksomhetINorgeSummary
            key={stepKey}
            skjema={skjema}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <SkjemaSteg
      config={{
        stepKey: oppsummeringStepKey,
        stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
        customNesteKnapp: {
          tekst: t("felles.sendSoknad"),
          ikon: <PaperplaneIcon />,
          type: "submit",
        },
      }}
    >
      {ARBEIDSGIVER_STEG_REKKEFOLGE.filter(
        (steg) => steg.key !== oppsummeringStepKey,
      ).map((steg) => renderStepSummary(steg.key))}
    </SkjemaSteg>
  );
}

function ArbeidsgiverenStegSummary({ skjema }: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const arbeidsgiverenStegData = skjema.data.arbeidsgiveren;
  const arbeidsgiverSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidsgiverStepKey,
  );
  const editHref = arbeidsgiverSteg?.route.replace("$id", skjema.id) || "";

  return arbeidsgiverenStegData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">
          {t("arbeidsgiverSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsgiverSteg.arbeidsgiverensOrganisasjonsnummer")}
          </FormSummary.Label>
          <FormSummary.Value>
            {arbeidsgiverenStegData.organisasjonsnummer}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsgiverSteg.organisasjonensNavn")}
          </FormSummary.Label>
          <FormSummary.Value>
            {arbeidsgiverenStegData.organisasjonNavn}
          </FormSummary.Value>
        </FormSummary.Answer>
      </FormSummary.Answers>

      <FormSummary.Footer>
        <FormSummary.EditLink href={editHref}>
          {t("felles.endreSvar")}
        </FormSummary.EditLink>
      </FormSummary.Footer>
    </FormSummary>
  ) : null;
}

function ArbeidsgiverensVirksomhetINorgeSummary({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const virksomhetData = skjema.data.arbeidsgiverensVirksomhetINorge;
  const virksomhetSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidsgiverensVirksomhetINorgeStepKey,
  );
  const editHref = virksomhetSteg?.route.replace("$id", skjema.id) || "";

  return virksomhetData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">
          {t("arbeidsgiverensVirksomhetINorgeSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        {virksomhetData.erArbeidsgiverenOffentligVirksomhet != null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEnOffentligVirksomhet",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.erArbeidsgiverenOffentligVirksomhet,
                t,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        {virksomhetData.erArbeidsgiverenBemanningsEllerVikarbyraa != null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEtBemanningsEllerVikarbyra",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.erArbeidsgiverenBemanningsEllerVikarbyraa,
                t,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        {virksomhetData.opprettholderArbeidsgivereVanligDrift != null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidsgiverensVirksomhetINorgeSteg.opprettholderArbeidsgivereVanligDriftINorge",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.opprettholderArbeidsgivereVanligDrift,
                t,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}
      </FormSummary.Answers>

      <FormSummary.Footer>
        <FormSummary.EditLink href={editHref}>
          {t("felles.endreSvar")}
        </FormSummary.EditLink>
      </FormSummary.Footer>
    </FormSummary>
  ) : null;
}
