import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { landKodeTilNavn } from "~/components/LandVelgerFormPart.tsx";
import {
  Ansettelsesform,
  UtenlandskVirksomhet,
  UtenlandskVirksomhetMedAnsettelsesform,
} from "~/types/melosysSkjemaTypes";
import { useBooleanToJaNei } from "~/utils/translation.ts";

const ansettelsesformTilOversettelsesnokkel: Record<Ansettelsesform, string> = {
  [Ansettelsesform.ARBEIDSTAKER_ELLER_FRILANSER]:
    "utenlandskeVirksomheterFormPart.arbeidstakerEllerFrilanser",
  [Ansettelsesform.SELVSTENDIG_NAERINGSDRIVENDE]:
    "utenlandskeVirksomheterFormPart.selvstendigNaeringsdrivende",
  [Ansettelsesform.STATSANSATT]: "utenlandskeVirksomheterFormPart.statsansatt",
};

interface UtenlandskVirksomhetOppsummeringProps {
  virksomhet: UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform;
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
        <FormSummary.Value>
          {landKodeTilNavn(virksomhet.land)}
        </FormSummary.Value>
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
      {"ansettelsesform" in virksomhet && virksomhet.ansettelsesform && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandskeVirksomheterFormPart.ansettelsesform")}
          </FormSummary.Label>
          <FormSummary.Value>
            {t(
              ansettelsesformTilOversettelsesnokkel[virksomhet.ansettelsesform],
            )}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
    </FormSummary.Answers>
  );
}

interface UtenlandskeVirksomheterOppsummeringProps {
  virksomheter?: Array<
    UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform
  >;
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
