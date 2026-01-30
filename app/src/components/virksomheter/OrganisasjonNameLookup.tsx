import { Tooltip } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";

import { getOrganisasjonQueryOptions } from "~/httpClients/melsosysSkjemaApiClient.ts";

/**
 * Komponent som viser organisasjonsnavn basert p� organisasjonsnummer.
 * Hvis navn er tilgjengelig, vises navnet med organisasjonsnummer i en tooltip.
 * Hvis navn ikke er tilgjengelig, vises kun organisasjonsnummeret.
 *
 * @example
 * <OrganisasjonNameLookup orgnummer="123456789" />
 */
export function OrganisasjonNameLookup({ orgnummer }: { orgnummer: string }) {
  const { data: organisasjon } = useQuery(
    getOrganisasjonQueryOptions(orgnummer),
  );

  if (!organisasjon?.navn) {
    return <span>{orgnummer}</span>;
  }

  return (
    <Tooltip content={orgnummer}>
      <span
        aria-label={`${organisasjon.navn} med organisasjonsnummer ${orgnummer}`}
      >
        {organisasjon.navn}
      </span>
    </Tooltip>
  );
}
