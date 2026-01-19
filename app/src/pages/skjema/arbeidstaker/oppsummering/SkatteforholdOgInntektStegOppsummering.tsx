import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { landKodeTilNavn } from "~/components/LandVelgerFormPart.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as skatteforholdOgInntektStepKey } from "../skatteforhold-og-inntekt/SkatteforholdOgInntektSteg.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";

export function SkatteforholdOgInntektStegOppsummering({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();
  const { getSeksjon, getFelt } = useSkjemaDefinisjon();

  const seksjon = getSeksjon("skatteforholdOgInntekt");
  const erSkattepliktigFelt = getFelt(
    "skatteforholdOgInntekt",
    "erSkattepliktigTilNorgeIHeleutsendingsperioden",
  );
  const mottarPengestotteFelt = getFelt(
    "skatteforholdOgInntekt",
    "mottarPengestotteFraAnnetEosLandEllerSveits",
  );
  const landSomUtbetalerFelt = getFelt(
    "skatteforholdOgInntekt",
    "landSomUtbetalerPengestotte",
  );
  const belopFelt = getFelt(
    "skatteforholdOgInntekt",
    "pengestotteSomMottasFraAndreLandBelop",
  );
  const beskrivelseFelt = getFelt(
    "skatteforholdOgInntekt",
    "pengestotteSomMottasFraAndreLandBeskrivelse",
  );

  const skatteforholdData = skjema.data.skatteforholdOgInntekt;
  const skatteforholdSteg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === skatteforholdOgInntektStepKey,
  );
  const editHref = skatteforholdSteg?.route.replace("$id", skjema.id) || "";

  return (
    skatteforholdData && (
      <FormSummary className="mt-8">
        <FormSummary.Header>
          <FormSummary.Heading level="2">{seksjon.tittel}</FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>{erSkattepliktigFelt.label}</FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                skatteforholdData.erSkattepliktigTilNorgeIHeleutsendingsperioden,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>{mottarPengestotteFelt.label}</FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                skatteforholdData.mottarPengestotteFraAnnetEosLandEllerSveits,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>

          {skatteforholdData.landSomUtbetalerPengestotte && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {landSomUtbetalerFelt.label}
              </FormSummary.Label>
              <FormSummary.Value>
                {landKodeTilNavn(skatteforholdData.landSomUtbetalerPengestotte)}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {skatteforholdData.pengestotteSomMottasFraAndreLandBelop && (
            <FormSummary.Answer>
              <FormSummary.Label>{belopFelt.label}</FormSummary.Label>
              <FormSummary.Value>
                {skatteforholdData.pengestotteSomMottasFraAndreLandBelop}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {skatteforholdData.pengestotteSomMottasFraAndreLandBeskrivelse && (
            <FormSummary.Answer>
              <FormSummary.Label>{beskrivelseFelt.label}</FormSummary.Label>
              <FormSummary.Value style={{ whiteSpace: "pre-wrap" }}>
                {skatteforholdData.pengestotteSomMottasFraAndreLandBeskrivelse}
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
