import {
  DatePicker,
  useDatepicker,
  UseDatepickerOptions,
} from "@navikt/ds-react";
import { formatISO } from "date-fns";
import { Ref, useImperativeHandle, useRef } from "react";
import { get, useFormContext } from "react-hook-form";

import { useTranslateError } from "~/utils/translation.ts";

export type DatePickerFormPartHandle = {
  /** Tømmer feltet uten å trigge validering (ingen "påkrevd"-feil vises). */
  clearWithoutValidation: () => void;
};

type DatePickerFormPartProps = {
  formFieldName: string;
  label: string;
  description?: string;
  className?: string;
  error?: string;
  ref?: Ref<DatePickerFormPartHandle>;
  /** Kalles i tillegg til den interne lagringen når datoen endres. */
  onDateChange?: (date?: Date) => void;
} & Omit<UseDatepickerOptions, "onDateChange">;

export function DatePickerFormPart({
  formFieldName,
  label,
  description,
  className,
  error: externalError,
  ref,
  onDateChange,
  ...datePickerOptions
}: DatePickerFormPartProps) {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const translateError = useTranslateError();

  // Engangssignal: settes når feltet tømmes programmatisk, slik at den
  // påfølgende onDateChange hopper over validering for nettopp den endringen.
  const skipValidationRef = useRef(false);

  // Registrer feltet i react-hook-form slik at valideringsfeil
  // fra zodResolver legges inn i formState.errors for dette feltet
  register(formFieldName);

  const fieldError = get(errors, formFieldName)?.message as string | undefined;
  const error = translateError(externalError || fieldError);

  const datePicker = useDatepicker({
    onDateChange: (date) => {
      const shouldValidate = !skipValidationRef.current;
      skipValidationRef.current = false;

      setValue(
        formFieldName,
        date ? formatISO(date, { representation: "date" }) : undefined,
        { shouldValidate },
      );
      if (!shouldValidate) {
        clearErrors(formFieldName);
      }
      onDateChange?.(date);
    },
    ...datePickerOptions,
  });

  useImperativeHandle(
    ref,
    () => ({
      clearWithoutValidation: () => {
        skipValidationRef.current = true;
        datePicker.setSelected(undefined);
      },
    }),
    [datePicker],
  );

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
