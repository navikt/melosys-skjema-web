import { ErrorMessage, UseDatepickerOptions } from "@navikt/ds-react";
import { get, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DatePickerFormPart } from "./DatePickerFormPart.tsx";

type PeriodeFormPartProps = {
  formFieldName: string;
  label?: string;
  fraDatoLabel?: string;
  tilDatoLabel?: string;
  tilDatoDescription?: string;
  className?: string;
  defaultFraDato?: Date;
  defaultTilDato?: Date;
} & Omit<UseDatepickerOptions, "onDateChange" | "defaultSelected">;

export function PeriodeFormPart({
  formFieldName,
  label,
  fraDatoLabel,
  tilDatoLabel,
  tilDatoDescription,
  className,
  defaultFraDato,
  defaultTilDato,
  ...datePickerOptions
}: PeriodeFormPartProps) {
  const { t } = useTranslation();
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const fraDato = useWatch({ control, name: `${formFieldName}.fraDato` });
  const tilDato = useWatch({ control, name: `${formFieldName}.tilDato` });

  const periodeError = get(errors, formFieldName);
  const periodeErPakrevdErrorMessage =
    (periodeError?.message?.includes("undefined") ||
      periodeError?.message === "periode.datoErPakrevd") &&
    "periode.datoErPakrevd";

  return (
    <div className={className}>
      {label && <h3 className="mb-4 text-lg font-semibold">{label}</h3>}

      <DatePickerFormPart
        className="mt-4"
        defaultSelected={defaultFraDato}
        error={!fraDato && periodeErPakrevdErrorMessage}
        formFieldName={`${formFieldName}.fraDato`}
        label={fraDatoLabel ?? t("periode.fraDato")}
        {...datePickerOptions}
      />

      <DatePickerFormPart
        className="mt-4"
        defaultSelected={defaultTilDato}
        description={tilDatoDescription}
        error={!tilDato && periodeErPakrevdErrorMessage}
        formFieldName={`${formFieldName}.tilDato`}
        label={tilDatoLabel ?? t("periode.tilDato")}
        {...datePickerOptions}
      />
      {!periodeErPakrevdErrorMessage && periodeError ? (
        <ErrorMessage className="mt-1">{t(periodeError.message)}</ErrorMessage>
      ) : undefined}
    </div>
  );
}
