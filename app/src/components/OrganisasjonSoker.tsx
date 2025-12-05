import { Alert, BodyShort, Heading, Loader, Search } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getOrganisasjonMedJuridiskEnhetQuery } from "~/httpClients/melsosysSkjemaApiClient";
import { radgiverfirmaSchema } from "~/pages/representasjon/velg-radgiverfirma/radgiverfirmaSchema";
import { SimpleOrganisasjonDto } from "~/types/melosysSkjemaTypes.ts";

interface OrganisasjonSokerProps {
  /** Label for søkefeltet */
  label: string;
  /** Callback når organisasjon er funnet og validert */
  onOrganisasjonValgt: (organisasjon: SimpleOrganisasjonDto) => void;
  /** Initial verdi for søkefeltet */
  initialValue?: string;
  /** Om søkefeltet skal ha autofokus */
  autoFocus?: boolean;
}

export function OrganisasjonSoker({
  label,
  onOrganisasjonValgt,
  initialValue = "",
  autoFocus = false,
}: OrganisasjonSokerProps) {
  const { t } = useTranslation();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>(initialValue);
  const [valgtOrganisasjon, setValgtOrganisasjon] =
    useState<SimpleOrganisasjonDto | null>(null);

  const organisasjonQuery = useQuery({
    ...getOrganisasjonMedJuridiskEnhetQuery(searchValue || ""),
    enabled: false, // Disable auto-fetch, vi kaller refetch manuelt
  });

  const getErrorMessage = (): string | null => {
    if (validationError) return validationError;
    if (!organisasjonQuery.isError) return null;

    const error = organisasjonQuery.error;
    const statusMatch = error.message.match(/status:\s*(\d+)/);
    const status = statusMatch ? statusMatch[1] : null;

    if (status === "429") {
      return t("velgRadgiverfirma.rateLimitOverskredet");
    }
    if (status === "404") {
      return t("velgRadgiverfirma.organisasjonIkkeFunnet");
    }
    return t("velgRadgiverfirma.feilVedSok");
  };

  const handleSearch = async (value: string): Promise<void> => {
    const result = radgiverfirmaSchema.safeParse({
      organisasjonsnummer: value,
    });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message;
      setValidationError(errorMessage ? t(errorMessage) : null);
      setValgtOrganisasjon(null);
      return;
    }

    setValidationError(null);

    // Fetch organisasjon
    const response = await organisasjonQuery.refetch();

    if (response.data) {
      const org: SimpleOrganisasjonDto = {
        orgnr: response.data.juridiskEnhet.organisasjonsnummer,
        navn:
          response.data.juridiskEnhet.navn?.sammensattnavn ||
          response.data.juridiskEnhet.navn?.navnelinje1 ||
          "",
      };

      setValgtOrganisasjon(org);
      onOrganisasjonValgt(org);
    }
  };

  const handleClear = (): void => {
    setSearchValue("");
    setValidationError(null);
    setValgtOrganisasjon(null);
  };

  return (
    <div className="max-w-md w-full">
      <Search
        autoFocus={autoFocus}
        error={getErrorMessage() || undefined}
        hideLabel={false}
        label={label}
        onChange={(value: string) => setSearchValue(value)}
        onClear={handleClear}
        onSearchClick={handleSearch}
        size="medium"
        value={searchValue}
      />

      {organisasjonQuery.isFetching && (
        <div aria-live="polite" className="mt-4" role="status">
          <Loader size="medium" title={t("felles.laster")} />
        </div>
      )}

      {valgtOrganisasjon && !organisasjonQuery.isFetching && (
        <Alert className="mt-4" variant="success">
          <Heading level="3" size="small">
            {t("velgRadgiverfirma.valgtFirma")}
          </Heading>
          <BodyShort>
            {valgtOrganisasjon.navn} (org.nr. {valgtOrganisasjon.orgnr})
          </BodyShort>
        </Alert>
      )}
    </div>
  );
}
