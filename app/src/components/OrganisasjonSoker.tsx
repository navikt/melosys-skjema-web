import { Alert, Loader, TextField } from "@navikt/ds-react";
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
  /** Forhåndsutfylt organisasjonsnummer (for redigering) */
  initialOrgnr?: string;
}

export function OrganisasjonSoker({
  formFieldName,
  label,
  autoFocus = false,
  initialOrgnr = "",
}: OrganisasjonSokerProps) {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [searchValue, setSearchValue] = useState(initialOrgnr);

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

  const httpErrorMessage =
    query.isError && !(query.error instanceof ValideringError)
      ? query.error.message
      : null;
  const statusMatch = httpErrorMessage?.match(/status:\s*(\d+)/);
  const httpStatus = statusMatch ? statusMatch[1] : null;

  // 404 = manglende treff: en forventet situasjon, ikke en systemfeil. Vises som
  // egen warning-melding under feltet, ikke som rød feiltilstand i selve feltet.
  const visIngenTreff = httpStatus === "404";

  const getErrorMessage = (): string | undefined => {
    if (query.isError) {
      if (query.error instanceof ValideringError) {
        return t("generellValidering.ugyldigOrganisasjonsnummer");
      }
      if (httpStatus === "429") {
        return t("generellValidering.rateLimitOverskredet");
      }
      if (httpStatus === "404") {
        return undefined; // vises som warning-melding via visIngenTreff
      }
      return t("generellValidering.feilVedSok");
    }

    if (typeof formError === "string") {
      return t(formError);
    }

    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const digitsOnly = e.target.value.replaceAll(/\D/g, "").slice(0, 9);
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
        onChange={handleChange}
        size="medium"
        value={searchValue}
      />

      {query.isFetching && (
        <div aria-live="polite" className="mt-4" role="status">
          <Loader size="medium" title={t("felles.laster")} />
        </div>
      )}

      {visIngenTreff && !query.isFetching && (
        <Alert
          aria-live="polite"
          className="mt-4"
          size="small"
          variant="warning"
        >
          {t("generellValidering.organisasjonIkkeFunnet")}
        </Alert>
      )}

      {valgtOrganisasjon && !query.isFetching && (
        <ValgtOrganisasjon valgtOrganisasjon={valgtOrganisasjon} />
      )}
    </div>
  );
}
