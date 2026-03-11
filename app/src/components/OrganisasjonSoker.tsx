import { Loader, TextField } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ValgtOrganisasjon } from "~/components/virksomheter/ValgtOrganisasjon.tsx";
import { getOrganisasjonMedJuridiskEnhetQuery } from "~/httpClients/melsosysSkjemaApiClient";
import { ValideringError } from "~/utils/valideringUtils.ts";

interface OrganisasjonSokerProps {
  /** Feltnavn i react-hook-form (SimpleOrganisasjonDto | null) */
  formFieldName: string;
  /** Label for tekstfeltet */
  label: string;
  /** Om feltet skal ha autofokus */
  autoFocus?: boolean;
}

export function OrganisasjonSoker({
  formFieldName,
  label,
  autoFocus = false,
}: OrganisasjonSokerProps) {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [searchValue, setSearchValue] = useState("");

  const isValidOrgNr = /^\d{9}$/.test(searchValue);

  const query = useQuery({
    ...getOrganisasjonMedJuridiskEnhetQuery(searchValue),
    enabled: isValidOrgNr,
  });

  const valgtOrganisasjon = useWatch({ control, name: formFieldName });

  // Synk query-data til form-verdi
  const queryOrg = query.data
    ? {
        orgnr: query.data.juridiskEnhet.orgnr,
        navn: query.data.juridiskEnhet.navn || "",
      }
    : null;

  if (queryOrg && valgtOrganisasjon?.orgnr !== queryOrg.orgnr) {
    setValue(formFieldName, queryOrg, { shouldValidate: true });
  }

  if (!queryOrg && valgtOrganisasjon) {
    setValue(formFieldName, null);
  }

  const formError = errors[formFieldName]?.message;

  const getErrorMessage = (): string | undefined => {
    if (query.isError) {
      if (query.error.name === ValideringError.name) {
        return t("velgRadgiverfirma.ugyldigOrganisasjonsnummer");
      }

      const statusMatch = query.error.message.match(/status:\s*(\d+)/);
      const status = statusMatch ? statusMatch[1] : null;

      if (status === "429") {
        return t("velgRadgiverfirma.rateLimitOverskredet");
      }
      if (status === "404") {
        return t("velgRadgiverfirma.organisasjonIkkeFunnet");
      }
      return t("velgRadgiverfirma.feilVedSok");
    }

    if (typeof formError === "string") {
      return t(formError);
    }

    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const digitsOnly = e.target.value.replaceAll(/\D/g, "");
    setSearchValue(digitsOnly);
    if (valgtOrganisasjon) {
      setValue(formFieldName, null);
    }
  };

  return (
    <div className="max-w-md w-full">
      <TextField
        autoFocus={autoFocus}
        error={getErrorMessage()}
        inputMode="numeric"
        label={label}
        maxLength={9}
        onChange={handleChange}
        size="medium"
        value={searchValue}
      />

      {query.isFetching && (
        <div aria-live="polite" className="mt-4" role="status">
          <Loader size="medium" title={t("felles.laster")} />
        </div>
      )}

      {valgtOrganisasjon && !query.isFetching && (
        <ValgtOrganisasjon valgtOrganisasjon={valgtOrganisasjon} />
      )}
    </div>
  );
}
