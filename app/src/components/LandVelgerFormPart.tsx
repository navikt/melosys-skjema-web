import { Select, SelectProps } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useTranslateError } from "~/utils/translation.ts";

type LandVelgerFormPartProps = {
  formFieldName: string;
  label: string;
  className?: string;
  landOptions?: Array<{ value: string; label: string }>;
} & Omit<SelectProps, "children" | "onChange" | "value">;

const defaultLandOptions = [
  { value: "SV", label: "Sverige" },
  { value: "DK", label: "Danmark" },
  { value: "FI", label: "Finland" },
  { value: "DE", label: "Tyskland" },
  { value: "FR", label: "Frankrike" },
  { value: "ES", label: "Spania" },
  { value: "IT", label: "Italia" },
  { value: "NL", label: "Nederland" },
  { value: "BE", label: "Belgia" },
  { value: "AT", label: "Østerrike" },
];

export function LandVelgerFormPart({
  formFieldName,
  label,
  className,
  landOptions = defaultLandOptions,
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
  const land = defaultLandOptions.find((land) => land.value === landkode);

  return land ? land.label : landkode;
}
