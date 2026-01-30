import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
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
  const { getSeksjon } = useSkjemaDefinisjon();
  const elementDef =
    getSeksjon("familiemedlemmer").felter.familiemedlemmer.elementDefinisjon;

  const fields = [
    {
      label: elementDef.fornavn.label,
      value: familiemedlem.fornavn,
    },
    {
      label: elementDef.etternavn.label,
      value: familiemedlem.etternavn,
    },
    {
      label: familiemedlem.harNorskFodselsnummerEllerDnummer
        ? elementDef.fodselsnummer.label
        : elementDef.fodselsdato.label,
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
  const { getSeksjon } = useSkjemaDefinisjon();

  const seksjon = getSeksjon("familiemedlemmer");
  const skalHaMedFelt = seksjon.felter.skalHaMedFamiliemedlemmer;
  const familiemedlemmerListeFelt = seksjon.felter.familiemedlemmer;

  const familiemedlemmerData = skjema.data.familiemedlemmer;
  const familiemedlemmerSteg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === familiemedlemmerStepKey,
  );
  const editHref = familiemedlemmerSteg?.route.replace("$id", skjema.id) || "";

  return (
    familiemedlemmerData && (
      <FormSummary className="mt-8">
        <FormSummary.Header>
          <FormSummary.Heading level="2">{seksjon.tittel}</FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>{skalHaMedFelt.label}</FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(familiemedlemmerData.skalHaMedFamiliemedlemmer)}
            </FormSummary.Value>
          </FormSummary.Answer>

          {familiemedlemmerData.familiemedlemmer.length > 0 && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {familiemedlemmerListeFelt.label}
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
