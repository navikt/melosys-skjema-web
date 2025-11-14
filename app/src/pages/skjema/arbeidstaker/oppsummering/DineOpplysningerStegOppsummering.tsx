import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as arbeidstakerenStepKey } from "../dine-opplysninger/DineOpplysningerSteg.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";

export function DineOpplysningerStegOppsummering({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const arbeidstakerenData = skjema.data.arbeidstakeren;
  const arbeidstakerenSteg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidstakerenStepKey,
  );
  const editHref = arbeidstakerenSteg?.route.replace("$id", skjema.id) || "";

  return (
    arbeidstakerenData && (
      <FormSummary className="mt-8">
        <FormSummary.Header>
          <FormSummary.Heading level="2">
            {t("dineOpplysningerSteg.tittel")}
          </FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              {t("dineOpplysningerSteg.harDuNorskFodselsnummerEllerDNummer")}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(arbeidstakerenData.harNorskFodselsnummer)}
            </FormSummary.Value>
          </FormSummary.Answer>

          {arbeidstakerenData.fodselsnummer && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("dineOpplysningerSteg.dittFodselsnummerEllerDNummer")}
              </FormSummary.Label>
              <FormSummary.Value>
                {arbeidstakerenData.fodselsnummer}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {arbeidstakerenData.fornavn && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("dineOpplysningerSteg.dittFornavn")}
              </FormSummary.Label>
              <FormSummary.Value>
                {arbeidstakerenData.fornavn}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {arbeidstakerenData.etternavn && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("dineOpplysningerSteg.dittEtternavn")}
              </FormSummary.Label>
              <FormSummary.Value>
                {arbeidstakerenData.etternavn}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {arbeidstakerenData.fodselsdato && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("dineOpplysningerSteg.dinFodselsdato")}
              </FormSummary.Label>
              <FormSummary.Value>
                {arbeidstakerenData.fodselsdato}
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
    )
  );
}
