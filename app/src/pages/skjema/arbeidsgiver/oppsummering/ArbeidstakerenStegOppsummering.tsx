import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { stepKey as arbeidstakerenStepKey } from "../arbeidstakeren/ArbeidstakerenSteg.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";

export function ArbeidstakerenStegOppsummering({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const arbeidstakerenStegData = skjema.data.arbeidstakeren;
  const arbeidstakerenSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidstakerenStepKey,
  );
  const editHref = arbeidstakerenSteg?.route.replace("$id", skjema.id) || "";

  return arbeidstakerenStegData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">
          {t("arbeidstakerenSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            {t(
              "arbeidstakerenSteg.harArbeidstakerenNorskFodselsnummerEllerDNummer",
            )}
          </FormSummary.Label>
          <FormSummary.Value>
            {arbeidstakerenStegData.fodselsnummer}
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
