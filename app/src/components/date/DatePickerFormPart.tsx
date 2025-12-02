import {
  DatePicker,
  useDatepicker,
  UseDatepickerOptions,
} from "@navikt/ds-react";
import { formatISO } from "date-fns";
import { get, useFormContext } from "react-hook-form";

import { useTranslateError } from "~/utils/translation.ts";

type DatePickerFormPartProps = {
  formFieldName: string;
  label: string;
  description?: string;
  className?: string;
  error?: string;
} & Omit<UseDatepickerOptions, "onDateChange">;

export function DatePickerFormPart({
  formFieldName,
  label,
  description,
  className,
  error: externalError,
  ...datePickerOptions
}: DatePickerFormPartProps) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const translateError = useTranslateError();

  const fieldError = get(errors, formFieldName)?.message as string | undefined;
  const error = translateError(externalError ?? fieldError);

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
