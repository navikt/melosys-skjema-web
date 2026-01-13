import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as familiemedlemmerStepKey } from "../familiemedlemmer/FamiliemedlemmerSteg.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";

export function FamiliemedlemmerStegOppsummering({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const familiemedlemmerData = skjema.data.familiemedlemmer;
  const familiemedlemmerSteg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === familiemedlemmerStepKey,
  );
  const editHref = familiemedlemmerSteg?.route.replace("$id", skjema.id) || "";

  return (
    familiemedlemmerData && (
      <FormSummary className="mt-8">
        <FormSummary.Header>
          <FormSummary.Heading level="2">
            {t("familiemedlemmerSteg.tittel")}
          </FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              {t("familiemedlemmerSteg.harDuFamiliemedlemmerSomSkalVaereMed")}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(familiemedlemmerData.skalHaMedFamiliemedlemmer)}
            </FormSummary.Value>
          </FormSummary.Answer>
        </FormSummary.Answers>

        <FormSummary.Footer>
          <FormSummary.EditLink href={editHref}>
            {t("felles.endreSvar")}
          </FormSummary.EditLink>
        </FormSummary.Footer>
      </FormSummary>
    )
  );
}
