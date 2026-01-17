import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { landKodeTilNavn } from "~/components/LandVelgerFormPart.tsx";
import { getFelt, getSeksjon } from "~/constants/skjemaDefinisjonA1";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";
import { stepKey as utenlandsoppdragetStepKey } from "../utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";

// Hent felt-definisjoner fra statisk kopi
const seksjon = getSeksjon("utenlandsoppdragetArbeidsgiver");
const utsendelseLandFelt = getFelt(
  "utenlandsoppdragetArbeidsgiver",
  "utsendelseLand",
);
const periodeFelt = seksjon.felter.arbeidstakerUtsendelsePeriode;
const harOppdragFelt = getFelt(
  "utenlandsoppdragetArbeidsgiver",
  "arbeidsgiverHarOppdragILandet",
);
const begrunnelseFelt = getFelt(
  "utenlandsoppdragetArbeidsgiver",
  "utenlandsoppholdetsBegrunnelse",
);
const bleAnsattFelt = getFelt(
  "utenlandsoppdragetArbeidsgiver",
  "arbeidstakerBleAnsattForUtenlandsoppdraget",
);
const vilJobbeEtterFelt = getFelt(
  "utenlandsoppdragetArbeidsgiver",
  "arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget",
);
const forblirAnsattFelt = getFelt(
  "utenlandsoppdragetArbeidsgiver",
  "arbeidstakerForblirAnsattIHelePerioden",
);
const ansettelsesforholdFelt = getFelt(
  "utenlandsoppdragetArbeidsgiver",
  "ansettelsesforholdBeskrivelse",
);
const erstatterFelt = getFelt(
  "utenlandsoppdragetArbeidsgiver",
  "arbeidstakerErstatterAnnenPerson",
);
const forrigePeriodeFelt = seksjon.felter.forrigeArbeidstakerUtsendelsePeriode;

export function UtenlandsoppdragetStegOppsummering({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const utenlandsoppdragData = skjema.data.utenlandsoppdraget;
  const utenlandsoppdragSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === utenlandsoppdragetStepKey,
  );
  const editHref = utenlandsoppdragSteg?.route.replace("$id", skjema.id) || "";

  return utenlandsoppdragData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">{seksjon.tittel}</FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>{utsendelseLandFelt.label}</FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(utenlandsoppdragData.utsendelseLand)}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>{periodeFelt.fraDatoLabel}</FormSummary.Label>
          <FormSummary.Value>
            {utenlandsoppdragData.arbeidstakerUtsendelsePeriode.fraDato}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>{periodeFelt.tilDatoLabel}</FormSummary.Label>
          <FormSummary.Value>
            {utenlandsoppdragData.arbeidstakerUtsendelsePeriode.tilDato}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>{harOppdragFelt.label}</FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(utenlandsoppdragData.arbeidsgiverHarOppdragILandet)}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.utenlandsoppholdetsBegrunnelse !== undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>{begrunnelseFelt.label}</FormSummary.Label>
            <FormSummary.Value>
              {utenlandsoppdragData.utenlandsoppholdetsBegrunnelse}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        <FormSummary.Answer>
          <FormSummary.Label>{bleAnsattFelt.label}</FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(
              utenlandsoppdragData.arbeidstakerBleAnsattForUtenlandsoppdraget,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget !==
          undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>{vilJobbeEtterFelt.label}</FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                utenlandsoppdragData.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        <FormSummary.Answer>
          <FormSummary.Label>{forblirAnsattFelt.label}</FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(
              utenlandsoppdragData.arbeidstakerForblirAnsattIHelePerioden,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.ansettelsesforholdBeskrivelse !== undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {ansettelsesforholdFelt.label}
            </FormSummary.Label>
            <FormSummary.Value>
              {utenlandsoppdragData.ansettelsesforholdBeskrivelse}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        <FormSummary.Answer>
          <FormSummary.Label>{erstatterFelt.label}</FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(
              utenlandsoppdragData.arbeidstakerErstatterAnnenPerson,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.forrigeArbeidstakerUtsendelsePeriode !==
          undefined && (
          <>
            <FormSummary.Answer>
              <FormSummary.Label>
                {forrigePeriodeFelt.label} - {forrigePeriodeFelt.fraDatoLabel}
              </FormSummary.Label>
              <FormSummary.Value>
                {
                  utenlandsoppdragData.forrigeArbeidstakerUtsendelsePeriode
                    .fraDato
                }
              </FormSummary.Value>
            </FormSummary.Answer>

            <FormSummary.Answer>
              <FormSummary.Label>
                {forrigePeriodeFelt.label} - {forrigePeriodeFelt.tilDatoLabel}
              </FormSummary.Label>
              <FormSummary.Value>
                {
                  utenlandsoppdragData.forrigeArbeidstakerUtsendelsePeriode
                    .tilDato
                }
              </FormSummary.Value>
            </FormSummary.Answer>
          </>
        )}
      </FormSummary.Answers>

      <FormSummary.Footer>
        <FormSummary.EditLink href={editHref}>
          {t("felles.endreSvar")}
        </FormSummary.EditLink>
      </FormSummary.Footer>
    </FormSummary>
  ) : null;
}
