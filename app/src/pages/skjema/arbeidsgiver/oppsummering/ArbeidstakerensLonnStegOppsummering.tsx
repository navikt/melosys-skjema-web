import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { NorskeOgUtenlandskeVirksomheterOppsummering } from "~/components/virksomheter/NorskeOgUtenlandskeVirksomheterOppsummering.tsx";
import { getFelt, getSeksjon } from "~/constants/skjemaDefinisjonA1";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as arbeidstakerensLonnStepKey } from "../arbeidstakerens-lonn/ArbeidstakerensLonnSteg.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";

// Hent felt-definisjoner fra statisk kopi
const seksjon = getSeksjon("arbeidstakerensLonn");
const betalerAllLonnFelt = getFelt(
  "arbeidstakerensLonn",
  "arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden",
);
const virksomheterFelt = getFelt(
  "arbeidstakerensLonn",
  "virksomheterSomUtbetalerLonnOgNaturalytelser",
);

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

  return lonnData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">{seksjon.tittel}</FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>{betalerAllLonnFelt.label}</FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(
              lonnData.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>
        <NorskeOgUtenlandskeVirksomheterOppsummering
          label={virksomheterFelt.label}
          norskeOgUtenlandskeVirksomheter={
            lonnData.virksomheterSomUtbetalerLonnOgNaturalytelser
          }
        />
      </FormSummary.Answers>

      <FormSummary.Footer>
        <FormSummary.EditLink href={editHref}>
          {t("felles.endreSvar")}
        </FormSummary.EditLink>
      </FormSummary.Footer>
    </FormSummary>
  ) : null;
}
