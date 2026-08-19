import { CheckmarkCircleFillIcon } from "@navikt/aksel-icons";
import { BodyShort, HStack } from "@navikt/ds-react";

interface ValgtOrganisasjonProperties {
  valgtOrganisasjon: {
    navn?: string;
    orgnr: string;
  };
}

export function ValgtOrganisasjon({
  valgtOrganisasjon,
}: ValgtOrganisasjonProperties) {
  return (
    <HStack align="center" className="mt-4" gap="space-8">
      <CheckmarkCircleFillIcon
        aria-hidden
        className="text-ax-bg-success-strong"
        fontSize="1.5rem"
      />
      <BodyShort>{valgtOrganisasjon.navn}</BodyShort>
    </HStack>
  );
}
