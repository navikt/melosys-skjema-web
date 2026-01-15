import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { Familiemedlem } from "~/types/melosysSkjemaTypes.ts";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as familiemedlemmerStepKey } from "../familiemedlemmer/FamiliemedlemmerSteg.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";

function FamiliemedlemOppsummeringItem({
  familiemedlem,
}: {
  familiemedlem: Familiemedlem;
}) {
  const { t } = useTranslation();

  const fields = [
    {
      label: t("familiemedlemmerSteg.fornavn"),
      value: familiemedlem.fornavn,
    },
    {
      label: t("familiemedlemmerSteg.etternavn"),
      value: familiemedlem.etternavn,
    },
    {
      label: familiemedlem.harNorskFodselsnummerEllerDnummer
        ? t("familiemedlemmerSteg.fodselsnummer")
        : t("familiemedlemmerSteg.fodselsdato"),
      value: familiemedlem.harNorskFodselsnummerEllerDnummer
        ? familiemedlem.fodselsnummer
        : familiemedlem.fodselsdato,
    },
  ];

  return (
    <FormSummary.Answers>
      {fields.map((field, index) => (
        <FormSummary.Answer key={index}>
          <FormSummary.Label>{field.label}</FormSummary.Label>
          <FormSummary.Value>{field.value}</FormSummary.Value>
        </FormSummary.Answer>
      ))}
    </FormSummary.Answers>
  );
}

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

          {familiemedlemmerData.familiemedlemmer.length > 0 && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("familiemedlemmerSteg.familiemedlemmer")}
              </FormSummary.Label>
              <FormSummary.Value
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--a-spacing-2)",
                }}
              >
                {familiemedlemmerData.familiemedlemmer.map(
                  (familiemedlem, index) => (
                    <FamiliemedlemOppsummeringItem
                      familiemedlem={familiemedlem}
                      key={index}
                    />
                  ),
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
    )
  );
}
