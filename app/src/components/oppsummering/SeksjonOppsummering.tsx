import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import type { SeksjonDefinisjonDto } from "~/types/melosysSkjemaTypes.ts";

import { FeltOppsummering } from "./FeltOppsummering.tsx";

interface SeksjonOppsummeringProps {
  seksjon: SeksjonDefinisjonDto;
  data: Record<string, unknown>;
  editHref?: string;
}

export function SeksjonOppsummering({
  data,
  editHref,
  seksjon,
}: SeksjonOppsummeringProps) {
  const { t } = useTranslation();

  const felterMedData = Object.entries(seksjon.felter).filter(
    ([feltNavn]) => data[feltNavn] !== undefined && data[feltNavn] !== null,
  );

  if (felterMedData.length === 0) return null;

  return (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="3">{seksjon.tittel}</FormSummary.Heading>
        {editHref && (
          <FormSummary.EditLink href={editHref}>
            {t("felles.endreSvar")}
          </FormSummary.EditLink>
        )}
      </FormSummary.Header>
      <FormSummary.Answers>
        {felterMedData.map(([feltNavn, felt]) => (
          <FeltOppsummering felt={felt} key={feltNavn} verdi={data[feltNavn]} />
        ))}
      </FormSummary.Answers>
    </FormSummary>
  );
}
