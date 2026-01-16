import { CheckmarkCircleFillIcon } from "@navikt/aksel-icons";
import { BodyShort, HStack } from "@navikt/ds-react";

interface ValgtOrganisasjonProps {
  valgtOrganisasjon: {
    navn?: string;
    orgnr: string;
  };
}

export function ValgtOrganisasjon({
  valgtOrganisasjon,
}: ValgtOrganisasjonProps) {
  return (
    <HStack align="center" className="mt-4" gap="2">
      <CheckmarkCircleFillIcon
        aria-hidden
        className="text-icon-success"
        fontSize="1.5rem"
      />
      <BodyShort>{valgtOrganisasjon.navn}</BodyShort>
    </HStack>
  );
}
