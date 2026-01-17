import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { getFelt, getSeksjon } from "~/constants/skjemaDefinisjonA1";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as arbeidsgiverensVirksomhetINorgeStepKey } from "../arbeidsgiverens-virksomhet-i-norge/ArbeidsgiverensVirksomhetINorgeSteg.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";

// Hent felt-definisjoner fra statisk kopi
const seksjon = getSeksjon("arbeidsgiverensVirksomhetINorge");
const erOffentligFelt = getFelt(
  "arbeidsgiverensVirksomhetINorge",
  "erArbeidsgiverenOffentligVirksomhet",
);
const erBemanningsbyraFelt = getFelt(
  "arbeidsgiverensVirksomhetINorge",
  "erArbeidsgiverenBemanningsEllerVikarbyraa",
);
const opprettholderDriftFelt = getFelt(
  "arbeidsgiverensVirksomhetINorge",
  "opprettholderArbeidsgiverenVanligDrift",
);

export function ArbeidsgiverensVirksomhetINorgeStegOppsummering({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const virksomhetData = skjema.data.arbeidsgiverensVirksomhetINorge;
  const virksomhetSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidsgiverensVirksomhetINorgeStepKey,
  );
  const editHref = virksomhetSteg?.route.replace("$id", skjema.id) || "";

  return virksomhetData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">{seksjon.tittel}</FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        {virksomhetData.erArbeidsgiverenOffentligVirksomhet !== undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>{erOffentligFelt.label}</FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.erArbeidsgiverenOffentligVirksomhet,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        {virksomhetData.erArbeidsgiverenBemanningsEllerVikarbyraa !==
          undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>{erBemanningsbyraFelt.label}</FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.erArbeidsgiverenBemanningsEllerVikarbyraa,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        {virksomhetData.opprettholderArbeidsgiverenVanligDrift !==
          undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {opprettholderDriftFelt.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.opprettholderArbeidsgiverenVanligDrift,
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
