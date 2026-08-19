import { Radio, RadioGroup, RadioGroupProps } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useTranslateError } from "~/utils/translation.ts";

type RadioGroupJaNeiProperties = Omit<
  RadioGroupProps,
  "onChange" | "children" | "error"
> & {
  formFieldName: string;
  lockedValue?: boolean;
  jaLabel?: string;
  neiLabel?: string;
};

export function RadioGroupJaNeiFormPart({
  formFieldName,
  lockedValue,
  jaLabel,
  neiLabel,
  ...properties
}: RadioGroupJaNeiProperties) {
  const { control } = useFormContext();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  return (
    <Controller
      control={control}
      name={formFieldName}
      render={({ field, fieldState }) => {
        // Når lockedValue er satt, bruk den i stedet for field.value
        const effectiveValue =
          lockedValue === undefined ? field.value : lockedValue;

        return (
          <RadioGroup
            {...properties}
            disabled={lockedValue !== undefined || properties.disabled}
            error={translateError(fieldState.error?.message)}
            onChange={(value) => {
              // Bare oppdater form state hvis ikke låst
              if (lockedValue === undefined) {
                field.onChange(value === "true");
              }
            }}
            value={
              effectiveValue === null || effectiveValue === undefined
                ? ""
                : effectiveValue.toString()
            }
          >
            <Radio size="small" value="true">
              {jaLabel ?? t("felles.ja")}
            </Radio>
            <Radio size="small" value="false">
              {neiLabel ?? t("felles.nei")}
            </Radio>
          </RadioGroup>
        );
      }}
    />
  );
}
