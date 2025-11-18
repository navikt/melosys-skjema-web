import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { NorskeOgUtenlandskeVirksomheterOppsummering } from "~/components/virksomheter/NorskeOgUtenlandskeVirksomheterOppsummering.tsx";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as arbeidssituasjonStepKey } from "../arbeidssituasjon/ArbeidssituasjonSteg.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";

export function ArbeidssituasjonStegOppsummering({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  const arbeidssituasjonData = skjema.data.arbeidssituasjon;
  const arbeidssituasjonSteg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidssituasjonStepKey,
  );
  const editHref = arbeidssituasjonSteg?.route.replace("$id", skjema.id) || "";

  return (
    arbeidssituasjonData && (
      <FormSummary className="mt-8">
        <FormSummary.Header>
          <FormSummary.Heading level="2">
            {t("arbeidssituasjonSteg.tittel")}
          </FormSummary.Heading>
        </FormSummary.Header>

        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidssituasjonSteg.harDuVaertEllerSkalVaereILonnetArbeidINorgeIMinst1ManedRettForUtsendingen",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                arbeidssituasjonData.harVaertEllerSkalVaereILonnetArbeidFoerUtsending,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>

          {arbeidssituasjonData.aktivitetIMaanedenFoerUtsendingen && (
            <FormSummary.Answer>
              <FormSummary.Label>
                {t("arbeidssituasjonSteg.beskriveAktivitetFoerUtsending")}
              </FormSummary.Label>
              <FormSummary.Value style={{ whiteSpace: "pre-wrap" }}>
                {arbeidssituasjonData.aktivitetIMaanedenFoerUtsendingen}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}

          <FormSummary.Answer>
            <FormSummary.Label>
              {t(
                "arbeidssituasjonSteg.skalDuOgsaDriveSelvstendigVirksomhetEllerJobbeForEnAnnenArbeidsgiver",
              )}
            </FormSummary.Label>
            <FormSummary.Value>
              {booleanToJaNei(
                arbeidssituasjonData.skalJobbeForFlereVirksomheter,
              )}
            </FormSummary.Value>
          </FormSummary.Answer>

          <NorskeOgUtenlandskeVirksomheterOppsummering
            label={t(
              "arbeidssituasjonSteg.hvemSkalDuJobbeForIUtsendelsesPerioden",
            )}
            norskeOgUtenlandskeVirksomheter={
              arbeidssituasjonData.virksomheterArbeidstakerJobberForIutsendelsesPeriode
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
