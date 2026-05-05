import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import type {
  ListeFeltDefinisjon,
  PeriodeFeltDefinisjon,
} from "~/types/melosysSkjemaTypes.ts";

import type { FeltUnion } from "./formaterVerdi.ts";
import { formaterVerdi } from "./formaterVerdi.ts";
import { ListeFeltOppsummering } from "./ListeFeltOppsummering.tsx";

interface FeltOppsummeringProps {
  felt: FeltUnion;
  feltNavn?: string;
  verdi: unknown;
}

export function FeltOppsummering({
  felt,
  feltNavn,
  verdi,
}: FeltOppsummeringProps) {
  const { t } = useTranslation();
  if (felt.type === "LIST") {
    return (
      <ListeFeltOppsummering
        felt={felt as ListeFeltDefinisjon}
        verdi={verdi as unknown[]}
      />
    );
  }

  if (felt.type === "PERIOD") {
    const periodeFelt = felt as PeriodeFeltDefinisjon;
    const periode = verdi as { fraDato?: string; tilDato?: string };
    return (
      <>
        <FormSummary.Answer>
          <FormSummary.Label>{periodeFelt.fraDatoLabel}</FormSummary.Label>
          <FormSummary.Value>{periode?.fraDato ?? "\u2013"}</FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>{periodeFelt.tilDatoLabel}</FormSummary.Label>
          <FormSummary.Value>{periode?.tilDato ?? "\u2013"}</FormSummary.Value>
        </FormSummary.Answer>
      </>
    );
  }

  if (felt.type === "TEXTAREA") {
    return (
      <FormSummary.Answer>
        <FormSummary.Label>{felt.label}</FormSummary.Label>
        <FormSummary.Value style={{ whiteSpace: "pre-wrap" }}>
          {formaterVerdi(felt, verdi, t, feltNavn)}
        </FormSummary.Value>
      </FormSummary.Answer>
    );
  }

  if (felt.type === "CHECKBOX_GROUP") {
    const formatted = formaterVerdi(felt, verdi, t, feltNavn);
    if (formatted === "\u2013") return null;
    return (
      <FormSummary.Answer>
        <FormSummary.Label>{felt.label}</FormSummary.Label>
        <FormSummary.Value>{formatted}</FormSummary.Value>
      </FormSummary.Answer>
    );
  }

  return (
    <FormSummary.Answer>
      <FormSummary.Label>{felt.label}</FormSummary.Label>
      <FormSummary.Value>
        {formaterVerdi(felt, verdi, t, feltNavn)}
      </FormSummary.Value>
    </FormSummary.Answer>
  );
}
