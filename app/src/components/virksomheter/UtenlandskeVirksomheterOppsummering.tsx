import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { utenlandskVirksomhetSchema } from "~/components/virksomheterSchema.ts";
import { useBooleanToJaNei } from "~/utils/translation.ts";

type UtenlandskVirksomhetFormData = z.infer<typeof utenlandskVirksomhetSchema>;

interface UtenlandskVirksomhetOppsummeringProps {
  virksomhet: UtenlandskVirksomhetFormData;
}

export function UtenlandskVirksomhetOppsummering({
  virksomhet,
}: UtenlandskVirksomhetOppsummeringProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  return (
    <FormSummary.Answers>
      <FormSummary.Answer>
        <FormSummary.Label>
          {t("utenlandskeVirksomheterFormPart.navnPaVirksomhet")}
        </FormSummary.Label>
        <FormSummary.Value>{virksomhet.navn}</FormSummary.Value>
      </FormSummary.Answer>
      {virksomhet.organisasjonsnummer && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t(
              "utenlandskeVirksomheterFormPart.organisasjonsnummerEllerRegistreringsnummerValgfritt",
            )}
          </FormSummary.Label>
          <FormSummary.Value>
            {virksomhet.organisasjonsnummer}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
      <FormSummary.Answer>
        <FormSummary.Label>
          {t("utenlandskeVirksomheterFormPart.vegnavnOgHusnummerEvtPostboks")}
        </FormSummary.Label>
        <FormSummary.Value>{virksomhet.vegnavnOgHusnummer}</FormSummary.Value>
      </FormSummary.Answer>
      {virksomhet.bygning && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandskeVirksomheterFormPart.bygningValgfritt")}
          </FormSummary.Label>
          <FormSummary.Value>{virksomhet.bygning}</FormSummary.Value>
        </FormSummary.Answer>
      )}
      {virksomhet.postkode && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandskeVirksomheterFormPart.postkodeValgfritt")}
          </FormSummary.Label>
          <FormSummary.Value>{virksomhet.postkode}</FormSummary.Value>
        </FormSummary.Answer>
      )}
      {virksomhet.byStedsnavn && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandskeVirksomheterFormPart.byStednavnValgfritt")}
          </FormSummary.Label>
          <FormSummary.Value>{virksomhet.byStedsnavn}</FormSummary.Value>
        </FormSummary.Answer>
      )}
      {virksomhet.region && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandskeVirksomheterFormPart.regionValgfritt")}
          </FormSummary.Label>
          <FormSummary.Value>{virksomhet.region}</FormSummary.Value>
        </FormSummary.Answer>
      )}
      <FormSummary.Answer>
        <FormSummary.Label>
          {t("utenlandskeVirksomheterFormPart.land")}
        </FormSummary.Label>
        <FormSummary.Value>{virksomhet.land}</FormSummary.Value>
      </FormSummary.Answer>
      <FormSummary.Answer>
        <FormSummary.Label>
          {t(
            "utenlandskeVirksomheterFormPart.tilhorerVirksomhetenSammeKonsernSomDenNorskeArbeidsgiveren",
          )}
        </FormSummary.Label>
        <FormSummary.Value>
          {booleanToJaNei(virksomhet.tilhorerSammeKonsern)}
        </FormSummary.Value>
      </FormSummary.Answer>
    </FormSummary.Answers>
  );
}

interface UtenlandskeVirksomheterOppsummeringProps {
  virksomheter?: Array<UtenlandskVirksomhetFormData>;
}

export function UtenlandskeVirksomheterOppsummering({
  virksomheter,
}: UtenlandskeVirksomheterOppsummeringProps) {
  const { t } = useTranslation();

  if (!virksomheter || virksomheter.length === 0) {
    return;
  }

  return (
    <FormSummary.Answer className="mt-4">
      <FormSummary.Label>
        {t("utenlandskeVirksomheterFormPart.utenlandskeVirksomheter")}
      </FormSummary.Label>
      <FormSummary.Value
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--a-spacing-2)",
        }}
      >
        {virksomheter.map((virksomhet, index) => (
          <UtenlandskVirksomhetOppsummering
            key={`utenlandsk-${index}`}
            virksomhet={virksomhet}
          />
        ))}
      </FormSummary.Value>
    </FormSummary.Answer>
  );
}
