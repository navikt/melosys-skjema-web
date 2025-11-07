import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { landKodeTilNavn } from "~/components/LandVelgerFormPart.tsx";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as skatteforholdOgInntektStepKey } from "../skatteforhold-og-inntekt/SkatteforholdOgInntektSteg.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";

export function SkatteforholdOgInntektStegOppsummering({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const skatteforholdData = skjema.data.skatteforholdOgInntekt;
  const skatteforholdSteg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === skatteforholdOgInntektStepKey,
  );
  const editHref = skatteforholdSteg?.route.replace("$id", skjema.id) || "";

  return (
    skatteforholdData && (
      <FormSummary className="mt-8">
        <FormSummary.Header>
          <FormSummary.Heading level="2">
            {t("skatteforholdOgInntektSteg.tittel")}
          </FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "skatteforholdOgInntektSteg.erDuSkattepliktigTilNorgeIHeleUtsendingsperioden",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                skatteforholdData.erSkattepliktigTilNorgeIHeleutsendingsperioden,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "skatteforholdOgInntektSteg.mottarDuPengestotteFraEtAnnetEosLandEllerSveits",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                skatteforholdData.mottarPengestotteFraAnnetEosLandEllerSveits,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>

          {skatteforholdData.landSomUtbetalerPengestotte && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t(
                  "skatteforholdOgInntektSteg.fraHvilketLandMottarDuPengestotte",
                )}
              </FormSummary.Label>
              <FormSummary.Value>
                {landKodeTilNavn(skatteforholdData.landSomUtbetalerPengestotte)}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {skatteforholdData.pengestotteSomMottasFraAndreLandBelop && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t(
                  "skatteforholdOgInntektSteg.hvorMyePengerMottarDuBruttoPerManed",
                )}
              </FormSummary.Label>
              <FormSummary.Value>
                {skatteforholdData.pengestotteSomMottasFraAndreLandBelop}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {skatteforholdData.pengestotteSomMottasFraAndreLandBeskrivelse && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("skatteforholdOgInntektSteg.hvaSlagsPengestotteMottarDu")}
              </FormSummary.Label>
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
