import { Checkbox, CheckboxGroup, CheckboxGroupProps } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";

import type { AlternativDefinisjonDto } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

type CheckboxGruppeFormPartProperties = Omit<
  CheckboxGroupProps,
  "onChange" | "children" | "error" | "value"
> & {
  formFieldName: string;
  alternativer: AlternativDefinisjonDto[];
};

export function CheckboxGruppeFormPart({
  formFieldName,
  alternativer,
  ...properties
}: CheckboxGruppeFormPartProperties) {
  const { control } = useFormContext();
  const translateError = useTranslateError();

  return (
    <Controller
      control={control}
      name={formFieldName}
      render={({ field, fieldState }) => (
        <CheckboxGroup
          {...properties}
          error={translateError(fieldState.error?.message)}
          value={field.value ?? []}
          onChange={field.onChange}
        >
          {alternativer.map((alt) => (
            <Checkbox key={alt.verdi} value={alt.verdi}>
              {alt.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      )}
    />
  );
}
