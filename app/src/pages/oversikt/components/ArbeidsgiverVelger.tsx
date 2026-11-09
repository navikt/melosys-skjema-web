import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { InfoCard, Link, UNSAFE_Combobox } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OrganisasjonDto } from "~/types/melosysSkjemaTypes.ts";

interface ArbeidsgiverVelgerProperties {
  arbeidsgivere: OrganisasjonDto[];
  formFieldName: string;
}

/**
 * Arbeidsgiver-velger (RADGIVER/ARBEIDSGIVER).
 *
 * Modi:
 * 1. Tom liste → InfoCard med warning
 * 2. Ellers → Combobox
 */
export function ArbeidsgiverVelger({
  arbeidsgivere,
  formFieldName,
}: ArbeidsgiverVelgerProperties) {
  const { t } = useTranslation();

  const { setValue } = useFormContext();

  if (arbeidsgivere.length === 0) {
    return (
      <InfoCard data-color="warning" role="status">
        <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
          <InfoCard.Title as="h3">
            {t("oversiktFelles.ingenArbeidsgivereTittel")}
          </InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          <p className="mb-4">{t("oversiktFelles.ingenArbeidsgivereInfo")}</p>
          <Link
            href={t("oversiktFelles.ingenArbeidsgivereLenkeUrl")}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("oversiktFelles.ingenArbeidsgivereLenke")}
          </Link>
        </InfoCard.Content>
      </InfoCard>
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
