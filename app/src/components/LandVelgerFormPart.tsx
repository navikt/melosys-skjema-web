import { Select, SelectProps } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useTranslateError } from "~/utils/translation.ts";

type LandVelgerFormPartProps = {
  formFieldName: string;
  label: string;
  className?: string;
} & Omit<SelectProps, "children" | "onChange" | "value">;

const landOptions = [
  { value: "BE", label: "Belgia" },
  { value: "BG", label: "Bulgaria" },
  { value: "DK", label: "Danmark" },
  { value: "EE", label: "Estland" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "Frankrike" },
  { value: "FO", label: "Færøyene" },
  { value: "GL", label: "Grønland" },
  { value: "GR", label: "Hellas" },
  { value: "IE", label: "Irland" },
  { value: "IS", label: "Island" },
  { value: "IT", label: "Italia" },
  { value: "HR", label: "Kroatia" },
  { value: "CY", label: "Kypros" },
  { value: "LV", label: "Latvia" },
  { value: "LI", label: "Liechtenstein" },
  { value: "LT", label: "Litauen" },
  { value: "LU", label: "Luxembourg" },
  { value: "MT", label: "Malta" },
  { value: "NL", label: "Nederland" },
  { value: "PL", label: "Polen" },
  { value: "PT", label: "Portugal" },
  { value: "RO", label: "Romania" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "ES", label: "Spania" },
  { value: "GB", label: "Storbritannia" },
  { value: "CH", label: "Sveits" },
  { value: "SE", label: "Sverige" },
  { value: "CZ", label: "Tsjekkia" },
  { value: "DE", label: "Tyskland" },
  { value: "HU", label: "Ungarn" },
  { value: "AT", label: "Østerrike" },
];

export function LandVelgerFormPart({
  formFieldName,
  label,
  className,
  ...selectProps
}: LandVelgerFormPartProps) {
  const { register, getFieldState, formState } = useFormContext();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const fieldState = getFieldState(formFieldName, formState);
  const error = translateError(fieldState.error?.message as string);

  return (
    <Select
      className={className}
      error={error}
      label={label}
      {...register(formFieldName)}
      {...selectProps}
    >
      <option value="">{t("landVelgerFormPart.velgLand")}</option>
      {landOptions.map((land) => (
        <option key={land.value} value={land.value}>
          {land.label}
        </option>
      ))}
    </Select>
  );
}

export function landKodeTilNavn(landkode: string): string {
  const land = landOptions.find((land) => land.value === landkode);

  return land ? land.label : landkode;
}
