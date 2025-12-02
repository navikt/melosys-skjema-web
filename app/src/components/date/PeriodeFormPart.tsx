import { UseDatepickerOptions } from "@navikt/ds-react";
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

  return (
    <div className={className}>
      {label && <h3 className="mb-4 text-lg font-semibold">{label}</h3>}

      <DatePickerFormPart
        className="mt-4"
        defaultSelected={defaultFraDato}
        formFieldName={`${formFieldName}.fraDato`}
        label={fraDatoLabel ?? t("felles.fraDato")}
        {...datePickerOptions}
      />

      <DatePickerFormPart
        className="mt-4"
        defaultSelected={defaultTilDato}
        description={tilDatoDescription}
        formFieldName={`${formFieldName}.tilDato`}
        label={tilDatoLabel ?? t("felles.tilDato")}
        {...datePickerOptions}
      />
    </div>
  );
}
