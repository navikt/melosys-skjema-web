import { FormSummary } from "@navikt/ds-react";

import type { SeksjonDefinisjonDto } from "~/types/melosysSkjemaTypes.ts";

import { FeltOppsummering } from "./FeltOppsummering.tsx";

interface SeksjonOppsummeringProps {
  seksjon: SeksjonDefinisjonDto;
  data: Record<string, unknown>;
}

export function SeksjonOppsummering({
  seksjon,
  data,
}: SeksjonOppsummeringProps) {
  const felterMedData = Object.entries(seksjon.felter).filter(
    ([feltNavn]) => data[feltNavn] !== undefined && data[feltNavn] !== null,
  );

  if (felterMedData.length === 0) return null;

  return (
    <FormSummary>
      <FormSummary.Header>
        <FormSummary.Heading level="3">{seksjon.tittel}</FormSummary.Heading>
      </FormSummary.Header>
      <FormSummary.Answers>
        {felterMedData.map(([feltNavn, felt]) => (
          <FeltOppsummering felt={felt} key={feltNavn} verdi={data[feltNavn]} />
        ))}
      </FormSummary.Answers>
    </FormSummary>
  );
}
