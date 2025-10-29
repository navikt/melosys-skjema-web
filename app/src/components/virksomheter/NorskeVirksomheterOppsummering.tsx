import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { norskVirksomhetSchema } from "~/components/virksomheter/virksomheterSchema.ts";

type NorskVirksomhetFormData = z.infer<typeof norskVirksomhetSchema>;

interface NorskVirksomhetOppsummeringProps {
  virksomhet: NorskVirksomhetFormData;
}

export function NorskVirksomhetOppsummering({
  virksomhet,
}: NorskVirksomhetOppsummeringProps) {
  const { t } = useTranslation();

  return (
    <FormSummary.Answers>
      <FormSummary.Answer>
        <FormSummary.Label>
          {t("norskeVirksomheterFormPart.organisasjonsnummer")}
        </FormSummary.Label>
        <FormSummary.Value>{virksomhet.organisasjonsnummer}</FormSummary.Value>
      </FormSummary.Answer>
    </FormSummary.Answers>
  );
}

interface NorskeVirksomheterOppsummeringProps {
  virksomheter?: Array<NorskVirksomhetFormData>;
}

export function NorskeVirksomheterOppsummering({
  virksomheter,
}: NorskeVirksomheterOppsummeringProps) {
  const { t } = useTranslation();

  if (!virksomheter || virksomheter.length === 0) {
    return;
  }

  return (
    <FormSummary.Answer className="mt-4">
      <FormSummary.Label>
        {t("norskeVirksomheterFormPart.norskeVirksomheter")}
      </FormSummary.Label>
      <FormSummary.Value
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--a-spacing-2)",
        }}
      >
        {virksomheter.map((virksomhet, index) => (
          <NorskVirksomhetOppsummering
            key={`norsk-${index}`}
            virksomhet={virksomhet}
          />
        ))}
      </FormSummary.Value>
    </FormSummary.Answer>
  );
}
