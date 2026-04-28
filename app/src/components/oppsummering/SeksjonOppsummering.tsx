import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { StegRolleIkon } from "~/components/StegRolleIkon.tsx";
import type { StegKey } from "~/constants/stegKeys.ts";
import type { SeksjonDefinisjonDto } from "~/types/melosysSkjemaTypes.ts";

import { FeltOppsummering } from "./FeltOppsummering.tsx";

interface SeksjonOppsummeringProps {
  seksjon: SeksjonDefinisjonDto;
  data: Record<string, unknown>;
  editHref?: string;
  stepKey?: StegKey;
}

export function SeksjonOppsummering({
  data,
  editHref,
  seksjon,
  stepKey,
}: SeksjonOppsummeringProps) {
  const { t } = useTranslation();

  const felterMedData = Object.entries(seksjon.felter).filter(
    ([feltNavn]) => data[feltNavn] !== undefined && data[feltNavn] !== null,
  );

  if (felterMedData.length === 0) return null;

  return (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="3">
          <span className="inline-flex items-center gap-2">
            <span>{seksjon.tittel}</span>
            {stepKey ? <StegRolleIkon stegKey={stepKey} /> : null}
          </span>
        </FormSummary.Heading>
      </FormSummary.Header>
      <FormSummary.Answers>
        {felterMedData.map(([feltNavn, felt]) => (
          <FeltOppsummering felt={felt} key={feltNavn} verdi={data[feltNavn]} />
        ))}
      </FormSummary.Answers>
      {editHref && (
        <FormSummary.Footer>
          <FormSummary.EditLink href={editHref}>
            {t("felles.endreSvar")}
          </FormSummary.EditLink>
        </FormSummary.Footer>
      )}
    </FormSummary>
  );
}
