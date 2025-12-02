import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { landKodeTilNavn } from "~/components/LandVelgerFormPart";

import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";
import { stepKey as utenlandsoppdragetStepKey } from "../utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";

export function UtenlandsoppdragetStegOppsummering({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();

  const utenlandsoppdragetData = skjema.data.utenlandsoppdraget;
  const utenlandsoppdragetSteg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === utenlandsoppdragetStepKey,
  );
  const editHref =
    utenlandsoppdragetSteg?.route.replace("$id", skjema.id) || "";

  return (
    utenlandsoppdragetData && (
      <FormSummary className="mt-8">
        <FormSummary.Header>
          <FormSummary.Heading level="2">
            {t("utenlandsoppdragetArbeidstakerSteg.tittel")}
          </FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "utenlandsoppdragetArbeidstakerSteg.iHvilketLandSkalDuUtforeArbeid",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {landKodeTilNavn(utenlandsoppdragetData.utsendelsesLand)}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {t("utenlandsoppdragetArbeidstakerSteg.fraDato")}
            </FormSummary.Label>
            <FormSummary.Value>
              {utenlandsoppdragetData.utsendelsePeriode.fraDato}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {t("utenlandsoppdragetArbeidstakerSteg.tilDato")}
            </FormSummary.Label>
            <FormSummary.Value>
              {utenlandsoppdragetData.utsendelsePeriode.tilDato}
            </FormSummary.Value>
          </FormSummary.Answer>
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
