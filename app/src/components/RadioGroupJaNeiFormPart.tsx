import { Radio, RadioGroup, RadioGroupProps } from "@navikt/ds-react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useTranslateError } from "~/utils/translation.ts";

type RadioGroupJaNeiProps = Omit<
  RadioGroupProps,
  "onChange" | "children" | "error"
> & {
  formFieldName: string;
  lockedValue?: boolean;
};

export function RadioGroupJaNeiFormPart({
  formFieldName,
  lockedValue,
  ...props
}: RadioGroupJaNeiProps) {
  const { control, setValue } = useFormContext();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  useEffect(() => {
    if (lockedValue !== undefined) {
      setValue(formFieldName, lockedValue);
    }
  }, [lockedValue, formFieldName, setValue]);

  return (
    <Controller
      control={control}
      name={formFieldName}
      render={({ field, fieldState }) => (
        <RadioGroup
          {...props}
          error={translateError(fieldState.error?.message)}
          onChange={(value) => field.onChange(value === "true")}
          value={field.value === undefined ? "" : field.value.toString()}
        >
          <Radio size="small" value="true">
            {t("felles.ja")}
          </Radio>
          <Radio size="small" value="false">
            {t("felles.nei")}
          </Radio>
        </RadioGroup>
      )}
    />
  );
}
