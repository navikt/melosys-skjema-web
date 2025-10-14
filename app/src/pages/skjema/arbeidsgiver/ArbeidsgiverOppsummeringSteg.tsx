import { PaperplaneIcon } from "@navikt/aksel-icons";
import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { stepKey as arbeidsgiverensVirksomhetINorgeStepKey } from "./ArbeidsgiverensVirksomhetINorgeSteg.tsx";
import { stepKey as arbeidsgiverStepKey } from "./ArbeidsgiverSteg.tsx";
import { stepKey as arbeidstakerensLonnStepKey } from "./ArbeidstakerensLonnSteg.tsx";
import { ArbeidsgiverStegLoader } from "./components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "./types.ts";
import { stepKey as utenlandsoppdragetStepKey } from "./UtenlandsoppdragetSteg.tsx";

const oppsummeringStepKey = "oppsummering";

function booleanToJaNei(value: boolean, t: (key: string) => string): string {
  return value ? t("felles.ja") : t("felles.nei");
}

interface ArbeidsgiverOppsummeringStegProps {
  id: string;
}

export function ArbeidsgiverOppsummeringSteg({
  id,
}: ArbeidsgiverOppsummeringStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <ArbeidsgiverOppsummeringStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}

function ArbeidsgiverOppsummeringStegContent({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const renderStepSummary = (stepKey: string) => {
    switch (stepKey) {
      case arbeidsgiverStepKey: {
        return <ArbeidsgiverenStegSummary key={stepKey} skjema={skjema} />;
      }
      case arbeidsgiverensVirksomhetINorgeStepKey: {
        return (
          <ArbeidsgiverensVirksomhetINorgeSummary
            key={stepKey}
            skjema={skjema}
          />
        );
      }
      case utenlandsoppdragetStepKey: {
        return <UtenlandsoppdragetSummary key={stepKey} skjema={skjema} />;
      }
      case arbeidstakerensLonnStepKey: {
        return <ArbeidstakerensLonnSummary key={stepKey} skjema={skjema} />;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <SkjemaSteg
      config={{
        stepKey: oppsummeringStepKey,
        stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
        customNesteKnapp: {
          tekst: t("felles.sendSoknad"),
          ikon: <PaperplaneIcon />,
          type: "submit",
        },
      }}
    >
      {ARBEIDSGIVER_STEG_REKKEFOLGE.filter(
        (steg) => steg.key !== oppsummeringStepKey,
      ).map((steg) => renderStepSummary(steg.key))}
    </SkjemaSteg>
  );
}

function ArbeidsgiverenStegSummary({ skjema }: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const arbeidsgiverenStegData = skjema.data.arbeidsgiveren;
  const arbeidsgiverSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidsgiverStepKey,
  );
  const editHref = arbeidsgiverSteg?.route.replace("$id", skjema.id) || "";

  return arbeidsgiverenStegData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">
          {t("arbeidsgiverSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsgiverSteg.arbeidsgiverensOrganisasjonsnummer")}
          </FormSummary.Label>
          <FormSummary.Value>
            {arbeidsgiverenStegData.organisasjonsnummer}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsgiverSteg.organisasjonensNavn")}
          </FormSummary.Label>
          <FormSummary.Value>
            {arbeidsgiverenStegData.organisasjonNavn}
          </FormSummary.Value>
        </FormSummary.Answer>
      </FormSummary.Answers>

      <FormSummary.Footer>
        <FormSummary.EditLink href={editHref}>
          {t("felles.endreSvar")}
        </FormSummary.EditLink>
      </FormSummary.Footer>
    </FormSummary>
  ) : null;
}

function ArbeidsgiverensVirksomhetINorgeSummary({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const virksomhetData = skjema.data.arbeidsgiverensVirksomhetINorge;
  const virksomhetSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidsgiverensVirksomhetINorgeStepKey,
  );
  const editHref = virksomhetSteg?.route.replace("$id", skjema.id) || "";

  return virksomhetData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">
          {t("arbeidsgiverensVirksomhetINorgeSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        {virksomhetData.erArbeidsgiverenOffentligVirksomhet != null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEnOffentligVirksomhet",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.erArbeidsgiverenOffentligVirksomhet,
                t,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        {virksomhetData.erArbeidsgiverenBemanningsEllerVikarbyraa != null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEtBemanningsEllerVikarbyra",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.erArbeidsgiverenBemanningsEllerVikarbyraa,
                t,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        {virksomhetData.opprettholderArbeidsgiverenVanligDrift != null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidsgiverensVirksomhetINorgeSteg.opprettholderArbeidsgiverenVanligDriftINorge",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                virksomhetData.opprettholderArbeidsgiverenVanligDrift,
                t,
              )}
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
  ) : null;
}

function UtenlandsoppdragetSummary({ skjema }: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

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
            {utenlandsoppdragData.utsendelseLand}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandsoppdragetSteg.fraDato")}
          </FormSummary.Label>
          <FormSummary.Value>
            {utenlandsoppdragData.arbeidstakerUtsendelseFraDato}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>
            {t("utenlandsoppdragetSteg.tilDato")}
          </FormSummary.Label>
          <FormSummary.Value>
            {utenlandsoppdragData.arbeidstakerUtsendelseTilDato}
          </FormSummary.Value>
        </FormSummary.Answer>

        <FormSummary.Answer>
          <FormSummary.Label>
            {t(
              "utenlandsoppdragetSteg.harDuSomArbeidsgiverOppdragILandetArbeidstakerSkalSendesUtTil",
            )}
          </FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(
              utenlandsoppdragData.arbeidsgiverHarOppdragILandet,
              t,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.utenlandsoppholdetsBegrunnelse != null && (
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
              t,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget !=
          null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "utenlandsoppdragetSteg.vilArbeidstakerenArbeideForVirksomhetenINorgeEtterUtenlandsoppdraget",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                utenlandsoppdragData.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget,
                t,
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
              t,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.ansettelsesforholdBeskrivelse != null && (
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
              t,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {utenlandsoppdragData.forrigeArbeidstakerUtsendelseFradato != null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t("utenlandsoppdragetSteg.forrigeArbeidstakersUtsendelse")} -{" "}
              {t("utenlandsoppdragetSteg.fraDato")}
            </FormSummary.Label>
            <FormSummary.Value>
              {utenlandsoppdragData.forrigeArbeidstakerUtsendelseFradato}
            </FormSummary.Value>
          </FormSummary.Answer>
        )}

        {utenlandsoppdragData.forrigeArbeidstakerUtsendelseTilDato != null && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t("utenlandsoppdragetSteg.forrigeArbeidstakersUtsendelse")} -{" "}
              {t("utenlandsoppdragetSteg.tilDato")}
            </FormSummary.Label>
            <FormSummary.Value>
              {utenlandsoppdragData.forrigeArbeidstakerUtsendelseTilDato}
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
  ) : null;
}

function ArbeidstakerensLonnSummary({ skjema }: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const lonnData = skjema.data.arbeidstakerensLonn;
  const lonnSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidstakerensLonnStepKey,
  );
  const editHref = lonnSteg?.route.replace("$id", skjema.id) || "";

  return lonnData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">
          {t("arbeidstakerenslonnSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            {t(
              "arbeidstakerenslonnSteg.utbetalerDuSomArbeidsgiverAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden",
            )}
          </FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(
              lonnData.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden,
              t,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {!lonnData.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden &&
          ((lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser
            ?.norskeVirksomheter != null &&
            lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser
              .norskeVirksomheter.length > 0) ||
            (lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser
              ?.utenlandskeVirksomheter != null &&
              lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser
                .utenlandskeVirksomheter.length > 0)) && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t(
                  "arbeidstakerenslonnSteg.hvemUtbetalerLonnenOgEventuelleNaturalytelser",
                )}
              </FormSummary.Label>
              <FormSummary.Value>
                {lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser?.norskeVirksomheter?.map(
                  (virksomhet, index) => (
                    <FormSummary.Answer key={`norsk-${index}`}>
                      <FormSummary.Value>
                        <FormSummary.Answers>
                          <FormSummary.Answer>
                            <FormSummary.Label>
                              {t(
                                "norskeVirksomheterFormPart.organisasjonsnummer",
                              )}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {virksomhet.organisasjonsnummer}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                        </FormSummary.Answers>
                      </FormSummary.Value>
                    </FormSummary.Answer>
                  ),
                )}
                {lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser?.utenlandskeVirksomheter?.map(
                  (virksomhet, index) => (
                    <FormSummary.Answer key={`utenlandsk-${index}`}>
                      <FormSummary.Value>
                        <FormSummary.Answers>
                          <FormSummary.Answer>
                            <FormSummary.Label>
                              {t(
                                "utenlandskeVirksomheterFormPart.navnPaVirksomhet",
                              )}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {virksomhet.navn}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                          <FormSummary.Answer>
                            <FormSummary.Label>
                              {t(
                                "norskeVirksomheterFormPart.organisasjonsnummer",
                              )}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {virksomhet.organisasjonsnummer}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                          <FormSummary.Answer>
                            <FormSummary.Label>
                              {t(
                                "utenlandskeVirksomheterFormPart.vegnavnOgHusnummerEvtPostboks",
                              )}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {virksomhet.vegnavnOgHusnummer}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                          {virksomhet.bygning && (
                            <FormSummary.Answer>
                              <FormSummary.Label>
                                {t(
                                  "utenlandskeVirksomheterFormPart.bygningValgfritt",
                                )}
                              </FormSummary.Label>
                              <FormSummary.Value>
                                {virksomhet.bygning}
                              </FormSummary.Value>
                            </FormSummary.Answer>
                          )}
                          <FormSummary.Answer>
                            <FormSummary.Label>
                              {t(
                                "utenlandskeVirksomheterFormPart.postkodeValgfritt",
                              )}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {virksomhet.postkode}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                          <FormSummary.Answer>
                            <FormSummary.Label>
                              {t(
                                "utenlandskeVirksomheterFormPart.byStednavnValgfritt",
                              )}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {virksomhet.byStedsnavn}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                          <FormSummary.Answer>
                            <FormSummary.Label>
                              {t(
                                "utenlandskeVirksomheterFormPart.regionValgfritt",
                              )}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {virksomhet.region}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                          <FormSummary.Answer>
                            <FormSummary.Label>
                              {t("utenlandskeVirksomheterFormPart.land")}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {virksomhet.land}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                          <FormSummary.Answer>
                            <FormSummary.Label>
                              {t(
                                "utenlandskeVirksomheterFormPart.tilhorerVirksomhetenSammeKonsernSomDenNorskeArbeidsgiveren",
                              )}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {booleanToJaNei(
                                virksomhet.tilhorerSammeKonsern,
                                t,
                              )}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                        </FormSummary.Answers>
                      </FormSummary.Value>
                    </FormSummary.Answer>
                  ),
                )}
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
  ) : null;
}
