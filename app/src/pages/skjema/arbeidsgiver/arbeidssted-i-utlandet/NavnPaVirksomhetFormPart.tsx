import { TextField } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useTranslateError } from "~/utils/translation.ts";

type NavnPaVirksomhetFormPartProps = {
  formFieldName: string;
  className?: string;
};

export function NavnPaVirksomhetFormPart({
  formFieldName,
  className,
}: NavnPaVirksomhetFormPartProps) {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={formFieldName}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          className={className}
          error={translateError(fieldState.error?.message)}
          label={t("arbeidsstedIUtlandetSteg.navnPaVirksomhet")}
          value={field.value ?? ""}
        />
      )}
    />
  );
}
