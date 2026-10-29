import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import type { VirksomhetElementDefinisjon } from "~/components/virksomheter/virksomhetDefinisjon.ts";
import {
  UtenlandskVirksomhet,
  UtenlandskVirksomhetMedAnsettelsesform,
} from "~/types/melosysSkjemaTypes";
import { useBooleanToJaNei } from "~/utils/translation.ts";

interface UtenlandskVirksomhetOppsummeringProperties {
  definisjon: VirksomhetElementDefinisjon;
  virksomhet: UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform;
}

export function UtenlandskVirksomhetOppsummering({
  definisjon,
  virksomhet,
}: UtenlandskVirksomhetOppsummeringProperties) {
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();
  const ansettelsesform =
    "ansettelsesform" in virksomhet ? virksomhet.ansettelsesform : undefined;
  const ansettelsesformDefinisjon = definisjon.ansettelsesform;

  return (
    <FormSummary.Answers>
      <Svar label={definisjon.navn.label} verdi={virksomhet.navn} />
      <Svar
        label={definisjon.organisasjonsnummerUtenlandsk.label}
        verdi={virksomhet.organisasjonsnummer}
      />
      <Svar
        label={definisjon.vegnavnOgHusnummer.label}
        verdi={virksomhet.vegnavnOgHusnummer}
      />
      <Svar label={definisjon.bygning.label} verdi={virksomhet.bygning} />
      <Svar label={definisjon.postkode.label} verdi={virksomhet.postkode} />
      <Svar
        label={definisjon.byStedsnavn.label}
        verdi={virksomhet.byStedsnavn}
      />
      <Svar label={definisjon.region.label} verdi={virksomhet.region} />
      <Svar
        label={definisjon.land.label}
        verdi={t(`land.${virksomhet.land}`)}
      />
      <Svar
        label={definisjon.tilhorerSammeKonsern.label}
        verdi={booleanToJaNei(virksomhet.tilhorerSammeKonsern)}
      />
      {ansettelsesformDefinisjon && ansettelsesform && (
        <Svar
          label={ansettelsesformDefinisjon.label}
          verdi={
            ansettelsesformDefinisjon.alternativer.find(
              (alternativ) => alternativ.verdi === ansettelsesform,
            )?.label ?? ansettelsesform
          }
        />
      )}
    </FormSummary.Answers>
  );
}

function Svar({ label, verdi }: { label: string; verdi?: string }) {
  return verdi ? (
    <FormSummary.Answer>
      <FormSummary.Label>{label}</FormSummary.Label>
      <FormSummary.Value>{verdi}</FormSummary.Value>
    </FormSummary.Answer>
  ) : null;
}
