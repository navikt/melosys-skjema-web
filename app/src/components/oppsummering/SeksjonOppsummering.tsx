import { FormSummary, HStack } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import type { StegIkon } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import type { SeksjonDefinisjonDto } from "~/types/melosysSkjemaTypes.ts";

import { FeltOppsummering } from "./FeltOppsummering.tsx";

interface SeksjonOppsummeringProps {
  seksjon: SeksjonDefinisjonDto;
  data: Record<string, unknown>;
  editHref?: string;
  icon?: StegIkon;
}

export function SeksjonOppsummering({
  data,
  editHref,
  icon,
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
        <FormSummary.Heading level="3">
          {icon ? (
            <HStack as="span" align="center" gap="space-8">
              {seksjon.tittel}
              <icon.icon
                aria-label={t(icon.ariaLabel)}
                role="img"
                fontSize="1.5rem"
              />
            </HStack>
          ) : (
            seksjon.tittel
          )}
        </FormSummary.Heading>
      </FormSummary.Header>
      <FormSummary.Answers>
        {felterMedData.map(([feltNavn, felt]) => (
          <FeltOppsummering
            felt={felt}
            feltNavn={feltNavn}
            key={feltNavn}
            verdi={data[feltNavn]}
          />
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
