import { Loader, TextField } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ValgtOrganisasjon } from "~/components/virksomheter/ValgtOrganisasjon.tsx";
import { getOrganisasjonMedJuridiskEnhetQuery } from "~/httpClients/melsosysSkjemaApiClient";
import { radgiverfirmaSchema } from "~/pages/representasjon/velg-radgiverfirma/radgiverfirmaSchema";
import { SimpleOrganisasjonDto } from "~/types/melosysSkjemaTypes.ts";

interface OrganisasjonSokerProps {
  /** Label for søkefeltet */
  label: string;
  /** Callback når organisasjon er funnet/validert, eller null når den fjernes */
  onOrganisasjonValgt: (organisasjon: SimpleOrganisasjonDto | null) => void;
  /** Initial verdi for søkefeltet */
  initialValue?: string;
  /** Om søkefeltet skal ha autofokus */
  autoFocus?: boolean;
  /** Når true, vis valideringsfeil selv om bruker ikke har søkt ennå */
  submitted?: boolean;
}

export function OrganisasjonSoker({
  label,
  onOrganisasjonValgt,
  initialValue = "",
  autoFocus = false,
  submitted = false,
}: OrganisasjonSokerProps) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>(initialValue);
  const [valgtOrganisasjon, setValgtOrganisasjon] =
    useState<SimpleOrganisasjonDto | null>(null);

  const organisasjonQuery = useQuery({
    ...getOrganisasjonMedJuridiskEnhetQuery(searchValue || ""),
    enabled: false,
  });

  const getApiErrorMessage = (): string | null => {
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

  const getDisplayError = (): string | undefined => {
    const apiError = getApiErrorMessage();
    if (apiError) return apiError;

    if (submitted && !valgtOrganisasjon) {
      const result = radgiverfirmaSchema.safeParse({
        organisasjonsnummer: searchValue,
      });
      if (!result.success) {
        const errorMessage = result.error.issues[0]?.message;
        return errorMessage ? t(errorMessage) : undefined;
      }
    }

    return undefined;
  };

  useEffect(() => {
    if (/^\d{9}$/.test(searchValue)) {
      void organisasjonQuery.refetch().then((response) => {
        if (response.data) {
          const org: SimpleOrganisasjonDto = {
            orgnr: response.data.juridiskEnhet.orgnr,
            navn: response.data.juridiskEnhet.navn || "",
          };
          setValgtOrganisasjon(org);
          onOrganisasjonValgt(org);
        }
      });
    }
  }, [searchValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const digitsOnly = e.target.value.replaceAll(/\D/g, "");
    setSearchValue(digitsOnly);
    setValgtOrganisasjon(null);
    onOrganisasjonValgt(null);
  };

  return (
    <div className="max-w-md w-full">
      <TextField
        autoFocus={autoFocus}
        error={getDisplayError()}
        inputMode="numeric"
        label={label}
        maxLength={9}
        onChange={handleChange}
        size="medium"
        value={searchValue}
      />

      {organisasjonQuery.isFetching && (
        <div aria-live="polite" className="mt-4" role="status">
          <Loader size="medium" title={t("felles.laster")} />
        </div>
      )}

      {valgtOrganisasjon && !organisasjonQuery.isFetching && (
        <ValgtOrganisasjon valgtOrganisasjon={valgtOrganisasjon} />
      )}
    </div>
  );
}
