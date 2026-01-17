import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { getSeksjon } from "~/constants/skjemaDefinisjonA1";
import {
  ArbeidsgiversSkjemaDto,
  ArbeidstakersSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { StegRekkefolgeItem } from "../Fremgangsindikator.tsx";

export const stepKey = "tilleggsopplysninger";

// Hent felt-definisjoner fra statisk kopi
// Vi bruker arbeidstaker-seksjonen da den har samme struktur som arbeidsgiver
const seksjon = getSeksjon("tilleggsopplysningerArbeidstaker");
const harFlereFelt = seksjon.felter.harFlereOpplysningerTilSoknaden;
const tilleggsopplysningerFelt = seksjon.felter.tilleggsopplysningerTilSoknad;

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
          <FormSummary.Heading level="2">{seksjon.tittel}</FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>{harFlereFelt.label}</FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                tilleggsopplysningerData.harFlereOpplysningerTilSoknaden,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>

          {tilleggsopplysningerData.tilleggsopplysningerTilSoknad && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {tilleggsopplysningerFelt.label}
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
