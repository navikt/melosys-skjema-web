import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { landKodeTilNavn } from "~/components/LandVelgerFormPart";
import { getFelt, getSeksjon } from "~/constants/skjemaDefinisjonA1";

import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";
import { stepKey as utenlandsoppdragetStepKey } from "../utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";

// Hent felt-definisjoner fra statisk kopi
const seksjon = getSeksjon("utenlandsoppdragetArbeidstaker");
const utsendelsesLandFelt = getFelt(
  "utenlandsoppdragetArbeidstaker",
  "utsendelsesLand",
);
const utsendelsePeriodeFelt = seksjon.felter.utsendelsePeriode;

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
          <FormSummary.Heading level="2">{seksjon.tittel}</FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>{utsendelsesLandFelt.label}</FormSummary.Label>
            <FormSummary.Value>
              {landKodeTilNavn(utenlandsoppdragetData.utsendelsesLand)}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {utsendelsePeriodeFelt.fraDatoLabel}
            </FormSummary.Label>
            <FormSummary.Value>
              {utenlandsoppdragetData.utsendelsePeriode.fraDato}
            </FormSummary.Value>
          </FormSummary.Answer>

          <FormSummary.Answer>
            <FormSummary.Label>
              {utsendelsePeriodeFelt.tilDatoLabel}
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
