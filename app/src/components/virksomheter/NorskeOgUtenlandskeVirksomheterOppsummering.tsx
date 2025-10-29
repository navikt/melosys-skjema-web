import { FormSummary } from "@navikt/ds-react";

import { NorskeVirksomheterOppsummering } from "~/components/virksomheter/NorskeVirksomheterOppsummering.tsx";
import { UtenlandskeVirksomheterOppsummering } from "~/components/virksomheter/UtenlandskeVirksomheterOppsummering.tsx";
import { NorskeOgUtenlandskeVirksomheter } from "~/types/melosysSkjemaTypes.ts";

type NorskeOgUtenlandskeVirksomheterOppsummeringProps = {
  norskeOgUtenlandskeVirksomheter?: NorskeOgUtenlandskeVirksomheter;
  label: string;
};

export function NorskeOgUtenlandskeVirksomheterOppsummering({
  norskeOgUtenlandskeVirksomheter,
  label,
}: NorskeOgUtenlandskeVirksomheterOppsummeringProps) {
  return (
    norskeOgUtenlandskeVirksomheter && (
      <FormSummary.Answer>
        <FormSummary.Label>{label}</FormSummary.Label>

        <NorskeVirksomheterOppsummering
          virksomheter={norskeOgUtenlandskeVirksomheter.norskeVirksomheter}
        />
        <UtenlandskeVirksomheterOppsummering
          virksomheter={norskeOgUtenlandskeVirksomheter.utenlandskeVirksomheter}
        />
      </FormSummary.Answer>
    )
  );
}
