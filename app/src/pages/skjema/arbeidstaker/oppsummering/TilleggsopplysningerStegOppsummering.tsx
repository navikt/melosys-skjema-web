import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { useBooleanToJaNei } from "~/utils/translation.ts";

import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { stepKey as tilleggsopplysningerStepKey } from "../tilleggsopplysninger/TilleggsopplysningerSteg.tsx";
import { ArbeidstakerSkjemaProps } from "../types.ts";

export function TilleggsopplysningerStegOppsummering({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const tilleggsopplysningerData = skjema.data.tilleggsopplysninger;
  const tilleggsopplysningerSteg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === tilleggsopplysningerStepKey,
  );
  const editHref =
    tilleggsopplysningerSteg?.route.replace("$id", skjema.id) || "";

  return (
    tilleggsopplysningerData && (
      <FormSummary className="mt-8">
        <FormSummary.Header>
          <FormSummary.Heading level="2">
            {t("tilleggsopplysningerSteg.tittel")}
          </FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "tilleggsopplysningerSteg.harDuNoenFlereOpplysningerTilSoknaden",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                tilleggsopplysningerData.harFlereOpplysningerTilSoknaden,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>

          {tilleggsopplysningerData.tilleggsopplysningerTilSoknad && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t(
                  "tilleggsopplysningerSteg.beskriveFlereOpplysningerTilSoknaden",
                )}
              </FormSummary.Label>
              <FormSummary.Value style={{ whiteSpace: "pre-wrap" }}>
                {tilleggsopplysningerData.tilleggsopplysningerTilSoknad}
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
