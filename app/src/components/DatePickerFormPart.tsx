import {
  DatePicker,
  useDatepicker,
  UseDatepickerOptions,
} from "@navikt/ds-react";
import { formatISO } from "date-fns";
import { useFormContext } from "react-hook-form";

import { useTranslateError } from "~/utils/translation.ts";

type DatePickerFormPartProps = {
  formFieldName: string;
  label: string;
  description?: string;
  className?: string;
} & Omit<UseDatepickerOptions, "onDateChange">;

export function DatePickerFormPart({
  formFieldName,
  label,
  description,
  className,
  ...datePickerOptions
}: DatePickerFormPartProps) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const translateError = useTranslateError();

  const error = translateError(errors[formFieldName]?.message as string);

  const datePicker = useDatepicker({
    onDateChange: (date) =>
      setValue(
        formFieldName,
        date ? formatISO(date, { representation: "date" }) : undefined,
        { shouldValidate: true },
      ),
    ...datePickerOptions,
  });

  return (
    <DatePicker {...datePicker.datepickerProps} dropdownCaption>
      <DatePicker.Input
        {...datePicker.inputProps}
        className={className}
        description={description}
        error={error}
        label={label}
      />
    </DatePicker>
  );
}
