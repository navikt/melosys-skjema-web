import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { NorskeOgUtenlandskeVirksomheterOppsummering } from "~/components/virksomheter/NorskeOgUtenlandskeVirksomheterOppsummering.tsx";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as arbeidstakerenStepKey } from "../arbeidstakeren/ArbeidstakerenSteg.tsx";
import { AKTIVITET_OPTIONS } from "../arbeidstakeren/arbeidstakerenStegSchema.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";

export function ArbeidstakerenStegOppsummering({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const arbeidstakerenData = skjema.data.arbeidstakeren;
  const arbeidstakerenSteg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidstakerenStepKey,
  );
  const editHref = arbeidstakerenSteg?.route.replace("$id", skjema.id) || "";

  return (
    arbeidstakerenData && (
      <FormSummary className="mt-8">
        <FormSummary.Header>
          <FormSummary.Heading level="2">
            {t("arbeidstakerenSteg.tittel")}
          </FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidstakerenSteg.harArbeidstakerenNorskFodselsnummerEllerDNummer",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(arbeidstakerenData.harNorskFodselsnummer)}
            </FormSummary.Value>
          </FormSummary.Answer>

          {arbeidstakerenData.fodselsnummer && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t(
                  "arbeidstakerenSteg.arbeidstakerensFodselsnummerEllerDNummer",
                )}
              </FormSummary.Label>
              <FormSummary.Value>
                {arbeidstakerenData.fodselsnummer}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {arbeidstakerenData.fornavn && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("arbeidstakerenSteg.arbeidstakerensFornavn")}
              </FormSummary.Label>
              <FormSummary.Value>
                {arbeidstakerenData.fornavn}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {arbeidstakerenData.etternavn && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("arbeidstakerenSteg.arbeidstakerensEtternavn")}
              </FormSummary.Label>
              <FormSummary.Value>
                {arbeidstakerenData.etternavn}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          {arbeidstakerenData.fodselsdato && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("arbeidstakerenSteg.arbeidstakerensFodselsdato")}
              </FormSummary.Label>
              <FormSummary.Value>
                {arbeidstakerenData.fodselsdato}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidstakerenSteg.harDuVaertEllerSkalVaereILonnetArbeidINorgeIMinst1ManedRettForUtsendingen",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                arbeidstakerenData.harVaertEllerSkalVaereILonnetArbeidFoerUtsending,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>

          {arbeidstakerenData.aktivitetIMaanedenFoerUtsendingen && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("arbeidstakerenSteg.aktivitet")}
              </FormSummary.Label>
              <FormSummary.Value>
                {t(
                  AKTIVITET_OPTIONS.find(
                    (opt) =>
                      opt.value ===
                      arbeidstakerenData.aktivitetIMaanedenFoerUtsendingen,
                  )?.labelKey || "",
                )}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          <FormSummary.Answer>
            <FormSummary.Label>
              {t("arbeidstakerenSteg.skalDuJobbeForFlereVirksomheterIPerioden")}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(arbeidstakerenData.skalJobbeForFlereVirksomheter)}
            </FormSummary.Value>
          </FormSummary.Answer>

          <NorskeOgUtenlandskeVirksomheterOppsummering
            label={t(
              "arbeidstakerenSteg.hvemSkalDuJobbeForIUtsendelsesPerioden",
            )}
            norskeOgUtenlandskeVirksomheter={
              arbeidstakerenData.virksomheterArbeidstakerJobberForIutsendelsesPeriode
            }
          />
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
