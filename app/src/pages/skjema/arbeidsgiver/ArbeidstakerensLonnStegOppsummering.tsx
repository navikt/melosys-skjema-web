import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as arbeidstakerensLonnStepKey } from "./ArbeidstakerensLonnSteg.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "./types.ts";

export function ArbeidstakerensLonnStegOppsummering({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const lonnData = skjema.data.arbeidstakerensLonn;
  const lonnSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidstakerensLonnStepKey,
  );
  const editHref = lonnSteg?.route.replace("$id", skjema.id) || "";

  const norskeVirksomheter =
    lonnData?.virksomheterSomUtbetalerLonnOgNaturalytelser?.norskeVirksomheter;
  const utenlandskeVirksomheter =
    lonnData?.virksomheterSomUtbetalerLonnOgNaturalytelser
      ?.utenlandskeVirksomheter;

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
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidstakerenslonnSteg.hvemUtbetalerLonnenOgEventuelleNaturalytelser",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {norskeVirksomheter && norskeVirksomheter.length > 0 && (
                <FormSummary.Answer>
                  <FormSummary.Label>
                    {t("norskeVirksomheterFormPart.norskeVirksomheter")}
                  </FormSummary.Label>
                  <FormSummary.Value>
                    {lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser.norskeVirksomheter?.map(
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
                  </FormSummary.Value>
                </FormSummary.Answer>
              )}
              {utenlandskeVirksomheter &&
                utenlandskeVirksomheter.length > 0 && (
                  <FormSummary.Answer>
                    <FormSummary.Label>
                      {t(
                        "utenlandskeVirksomheterFormPart.utenlandskeVirksomheter",
                      )}
                    </FormSummary.Label>
                    <FormSummary.Value>
                      {lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter?.map(
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
