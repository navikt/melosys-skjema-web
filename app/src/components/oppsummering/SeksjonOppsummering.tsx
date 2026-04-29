import { FormSummary, HStack } from "@navikt/ds-react";
import { ComponentType, SVGProps } from "react";
import { useTranslation } from "react-i18next";

import type { StegKey } from "~/constants/stegKeys.ts";
import type { SeksjonDefinisjonDto } from "~/types/melosysSkjemaTypes.ts";

import { FeltOppsummering } from "./FeltOppsummering.tsx";

interface SeksjonOppsummeringProps {
  seksjon: SeksjonDefinisjonDto;
  data: Record<string, unknown>;
  editHref?: string;
  stepKey?: StegKey;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  iconLabel?: string;
}

export function SeksjonOppsummering({
  data,
  editHref,
  icon: Icon,
  iconLabel,
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
          {Icon ? (
            <HStack as="span" align="center" gap="space-8">
              {seksjon.tittel}
              <Icon
                aria-label={iconLabel ? t(iconLabel) : undefined}
                aria-hidden={iconLabel ? undefined : true}
                role={iconLabel ? "img" : undefined}
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
