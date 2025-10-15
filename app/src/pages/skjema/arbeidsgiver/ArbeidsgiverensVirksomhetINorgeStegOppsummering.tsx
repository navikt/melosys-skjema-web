import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { stepKey as arbeidsgiverensVirksomhetINorgeStepKey } from "./ArbeidsgiverensVirksomhetINorgeSteg.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "./types.ts";

function booleanToJaNei(value: boolean, t: (key: string) => string): string {
  return value ? t("felles.ja") : t("felles.nei");
}

export function ArbeidsgiverensVirksomhetINorgeStegOppsummering({
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

        {virksomhetData.opprettholderArbeidsgiverenVanligDrift != null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidsgiverensVirksomhetINorgeSteg.opprettholderArbeidsgiverenVanligDriftINorge",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.opprettholderArbeidsgiverenVanligDrift,
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
