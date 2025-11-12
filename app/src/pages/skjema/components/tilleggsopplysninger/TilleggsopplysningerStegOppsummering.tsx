import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import {
  ArbeidsgiversSkjemaDto,
  ArbeidstakersSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { StegRekkefolgeItem } from "../Fremgangsindikator.tsx";

export const stepKey = "tilleggsopplysninger";

interface TilleggsopplysningerStegOppsummeringProps {
  skjema: ArbeidsgiversSkjemaDto | ArbeidstakersSkjemaDto;
  stegRekkefolge: StegRekkefolgeItem[];
}

export function TilleggsopplysningerStegOppsummering({
  skjema,
  stegRekkefolge,
}: TilleggsopplysningerStegOppsummeringProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const tilleggsopplysningerData = skjema.data.tilleggsopplysninger;
  const tilleggsopplysningerSteg = stegRekkefolge.find(
    (steg) => steg.key === stepKey,
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
