import { Alert, BodyShort, Heading } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

interface ValgtOrganisasjonProps {
  valgtOrganisasjon: {
    navn?: string;
    orgnr: string;
  };
}

export function ValgtOrganisasjon({
  valgtOrganisasjon,
}: ValgtOrganisasjonProps) {
  const { t } = useTranslation();

  return (
    <Alert className="mt-4" variant="success">
      <Heading level="3" size="small">
        {t("felles.valgtOrganisasjon")}
      </Heading>
      <BodyShort>
        {valgtOrganisasjon.navn} (org.nr. {valgtOrganisasjon.orgnr})
      </BodyShort>
    </Alert>
  );
}
