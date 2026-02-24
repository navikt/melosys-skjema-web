import { Alert, Heading, Loader, UNSAFE_Combobox } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { listAltinnTilganger } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { OrganisasjonDto } from "~/types/melosysSkjemaTypes.ts";

interface ArbeidsgiverVelgerProps {
  formFieldName: string;
}

/**
 * Wrapper som henter Altinn-tilganger og viser Loader/Error.
 * Rendrer ArbeidsgiverVelgerContent når data er klare.
 */
export function ArbeidsgiverVelger({ formFieldName }: ArbeidsgiverVelgerProps) {
  const { t } = useTranslation();

  const {
    data: arbeidsgivere,
    isLoading,
    isError,
  } = useQuery({
    ...listAltinnTilganger(),
    retry: false,
  });

  if (isLoading) {
    return <Loader size="medium" title={t("felles.laster")} />;
  }

  if (isError) {
    return (
      <Alert variant="error">
        {t("oversiktFelles.feilVedHentingAvArbeidsgivere")}
      </Alert>
    );
  }

  return (
    <ArbeidsgiverVelgerContent
      arbeidsgivere={arbeidsgivere ?? []}
      formFieldName={formFieldName}
    />
  );
}

interface ArbeidsgiverVelgerContentProps {
  arbeidsgivere: OrganisasjonDto[];
  formFieldName: string;
}

/**
 * Innhold for arbeidsgiver-velger (RADGIVER/ARBEIDSGIVER).
 *
 * Modi:
 * 1. Tom liste → Alert med warning
 * 2. Ellers → Combobox
 */
function ArbeidsgiverVelgerContent({
  arbeidsgivere,
  formFieldName,
}: ArbeidsgiverVelgerContentProps) {
  const { t } = useTranslation();

  const { setValue } = useFormContext();

  if (arbeidsgivere.length === 0) {
    return (
      <Alert variant="warning">
        <Heading level="3" size="small" spacing>
          {t("oversiktFelles.ingenArbeidsgivereTittel")}
        </Heading>
        <p className="mb-4">{t("oversiktFelles.ingenArbeidsgivereInfo")}</p>
        {/* TODO: Legg til faktisk URL til Altinn-dokumentasjon */}
        <a className="navds-link" href="#">
          {t("oversiktFelles.ingenArbeidsgivereLenke")}
        </a>
      </Alert>
    );
  }

  const options = arbeidsgivere.map((org) => ({
    label: `${org.navn} (${org.orgnr})`,
    value: org.orgnr,
  }));

  const handleComboboxValgt = (value: string) => {
    const valgtOrganisasjon = arbeidsgivere.find((org) => org.orgnr === value);

    if (valgtOrganisasjon) {
      setValue(formFieldName, {
        orgnr: valgtOrganisasjon.orgnr,
        navn: valgtOrganisasjon.navn,
      });
    }
  };

  return (
    <div className="max-w-lg w-full">
      <UNSAFE_Combobox
        description={t("oversiktFelles.arbeidsgiverVelgerInfo")}
        label={t("oversiktFelles.arbeidsgiverVelgerLabel")}
        onToggleSelected={(value) => handleComboboxValgt(value)}
        options={options}
        placeholder={t("oversiktFelles.arbeidsgiverVelgerPlaceholder")}
        shouldAutocomplete
        size="medium"
      />
    </div>
  );
}
