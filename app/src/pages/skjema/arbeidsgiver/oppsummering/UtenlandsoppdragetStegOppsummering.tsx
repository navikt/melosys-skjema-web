import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { landKodeTilNavn } from "~/components/LandVelgerFormPart.tsx";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";
import { stepKey as utenlandsoppdragetStepKey } from "../utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";

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
        <FormSummary.Heading level="2">
          {t("utenlandsoppdragetSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandsoppdragetSteg.hvilketLandSendesArbeidstakerenTil")}
          </FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(utenlandsoppdragData.utsendelseLand)}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandsoppdragetSteg.fraDato")}
          </FormSummary.Label>
          <FormSummary.Value>
            {utenlandsoppdragData.arbeidstakerUtsendelsePeriode.fraDato}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandsoppdragetSteg.tilDato")}
          </FormSummary.Label>
          <FormSummary.Value>
            {utenlandsoppdragData.arbeidstakerUtsendelsePeriode.tilDato}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>
            {t(
              "utenlandsoppdragetSteg.harDuSomArbeidsgiverOppdragILandetArbeidstakerSkalSendesUtTil",
            )}
          </FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(utenlandsoppdragData.arbeidsgiverHarOppdragILandet)}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.utenlandsoppholdetsBegrunnelse !== undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "utenlandsoppdragetSteg.hvorforSkalArbeidstakerenArbeideIUtlandet",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {utenlandsoppdragData.utenlandsoppholdetsBegrunnelse}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        <FormSummary.Answer>
          <FormSummary.Label>
            {t(
              "utenlandsoppdragetSteg.bleArbeidstakerAnsattPaGrunnAvDetteUtenlandsoppdraget",
            )}
          </FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(
              utenlandsoppdragData.arbeidstakerBleAnsattForUtenlandsoppdraget,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget !==
          undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "utenlandsoppdragetSteg.vilArbeidstakerenArbeideForVirksomhetenINorgeEtterUtenlandsoppdraget",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                utenlandsoppdragData.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        <FormSummary.Answer>
          <FormSummary.Label>
            {t(
              "utenlandsoppdragetSteg.vilArbeidstakerFortsattVareAnsattHostDereIHeleUtsendingsperioden",
            )}
          </FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(
              utenlandsoppdragData.arbeidstakerForblirAnsattIHelePerioden,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.ansettelsesforholdBeskrivelse !== undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "utenlandsoppdragetSteg.beskrivArbeidstakerensAnsettelsesforholdIUtsendingsperioden",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {utenlandsoppdragData.ansettelsesforholdBeskrivelse}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        <FormSummary.Answer>
          <FormSummary.Label>
            {t(
              "utenlandsoppdragetSteg.erstatterArbeidstakerEnAnnenPersonSomVarSendtUtForAGjoreDetSammeArbeidet",
            )}
          </FormSummary.Label>
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
                {t("utenlandsoppdragetSteg.forrigeArbeidstakersUtsendelse")} -{" "}
                {t("utenlandsoppdragetSteg.fraDato")}
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
                {t("utenlandsoppdragetSteg.forrigeArbeidstakersUtsendelse")} -{" "}
                {t("utenlandsoppdragetSteg.tilDato")}
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
