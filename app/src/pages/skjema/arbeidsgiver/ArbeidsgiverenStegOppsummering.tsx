import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { stepKey as arbeidsgiverStepKey } from "./ArbeidsgiverSteg.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "./types.ts";

export function ArbeidsgiverenStegOppsummering({
  skjema,
}: ArbeidsgiverSkjemaProps) {
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
