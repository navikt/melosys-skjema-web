import { Alert, Heading, UNSAFE_Combobox } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OrganisasjonDto } from "~/types/melosysSkjemaTypes.ts";

interface ArbeidsgiverVelgerProps {
  arbeidsgivere: OrganisasjonDto[];
  formFieldName: string;
}

/**
 * Arbeidsgiver-velger (RADGIVER/ARBEIDSGIVER).
 *
 * Modi:
 * 1. Tom liste → Alert med warning
 * 2. Ellers → Combobox
 */
export function ArbeidsgiverVelger({
  arbeidsgivere,
  formFieldName,
}: ArbeidsgiverVelgerProps) {
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
