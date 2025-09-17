import { Radio, RadioGroup, RadioGroupProps } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";

type RadioGroupJaNeiProps = Omit<
  RadioGroupProps,
  "onChange" | "value" | "children"
> & {
  formFieldName: string;
};

export function RadioGroupJaNeiFormPart({
  formFieldName,
  ...props
}: RadioGroupJaNeiProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={formFieldName}
      render={({ field }) => (
        <RadioGroup
          {...props}
          onChange={(value) => field.onChange(value === "true")}
          value={field.value === undefined ? "" : field.value.toString()}
        >
          <Radio size="small" value="true">
            Ja
          </Radio>
          <Radio size="small" value="false">
            Nei
          </Radio>
        </RadioGroup>
      )}
    />
  );
}
