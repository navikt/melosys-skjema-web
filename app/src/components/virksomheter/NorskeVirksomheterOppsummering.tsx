import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { OrganisasjonNameLookup } from "~/components/virksomheter/OrganisasjonNameLookup.tsx";
import { norskVirksomhetSchema } from "~/components/virksomheter/virksomheterSchema.ts";

type NorskVirksomhetFormData = z.infer<typeof norskVirksomhetSchema>;

interface NorskVirksomhetOppsummeringProperties {
  virksomhet: NorskVirksomhetFormData;
}

export function NorskVirksomhetOppsummering({
  virksomhet,
}: NorskVirksomhetOppsummeringProperties) {
  const { t } = useTranslation();

  return (
    <FormSummary.Answers>
      <FormSummary.Answer>
        <FormSummary.Label>
          {t("norskeVirksomheterFormPart.organisasjonsnummer")}
        </FormSummary.Label>
        <FormSummary.Value>{virksomhet.organisasjonsnummer}</FormSummary.Value>
        <FormSummary.Label>{t("felles.navn")}</FormSummary.Label>
        <FormSummary.Value>
          <OrganisasjonNameLookup orgnummer={virksomhet.organisasjonsnummer} />
        </FormSummary.Value>
      </FormSummary.Answer>
    </FormSummary.Answers>
  );
}

interface NorskeVirksomheterOppsummeringProperties {
  virksomheter?: Array<NorskVirksomhetFormData>;
}

export function NorskeVirksomheterOppsummering({
  virksomheter,
}: NorskeVirksomheterOppsummeringProperties) {
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
        {virksomheter.map((virksomhet) => (
          <NorskVirksomhetOppsummering
            key={virksomhet.organisasjonsnummer}
            virksomhet={virksomhet}
          />
        ))}
      </FormSummary.Value>
    </FormSummary.Answer>
  );
}
