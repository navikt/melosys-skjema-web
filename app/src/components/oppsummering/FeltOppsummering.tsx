import { FormSummary } from "@navikt/ds-react";

import type { ListeFeltDefinisjon } from "~/types/melosysSkjemaTypes.ts";

import type { FeltUnion } from "./formaterVerdi.ts";
import { formaterVerdi } from "./formaterVerdi.ts";
import { ListeFeltOppsummering } from "./ListeFeltOppsummering.tsx";

interface FeltOppsummeringProps {
  felt: FeltUnion;
  verdi: unknown;
}

export function FeltOppsummering({ felt, verdi }: FeltOppsummeringProps) {
  if (felt.type === "LIST") {
    return (
      <ListeFeltOppsummering
        felt={felt as ListeFeltDefinisjon}
        verdi={verdi as unknown[]}
      />
    );
  }

  return (
    <FormSummary.Answer>
      <FormSummary.Label>{felt.label}</FormSummary.Label>
      <FormSummary.Value>{formaterVerdi(felt, verdi)}</FormSummary.Value>
    </FormSummary.Answer>
  );
}
