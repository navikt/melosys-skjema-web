import { TextField } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";

import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
import { useTranslateError } from "~/utils/translation.ts";

type NavnPaVirksomhetFormPartProps = {
  formFieldName: string;
  className?: string;
};

export function NavnPaVirksomhetFormPart({
  formFieldName,
  className,
}: NavnPaVirksomhetFormPartProps) {
  const translateError = useTranslateError();
  const { control } = useFormContext();
  const { getFelt } = useSkjemaDefinisjon();
  const navnPaVirksomhetFelt = getFelt("arbeidsstedPaLand", "navnPaVirksomhet");

  return (
    <Controller
      control={control}
      name={formFieldName}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          className={className}
          error={translateError(fieldState.error?.message)}
          label={navnPaVirksomhetFelt.label}
          value={field.value ?? ""}
        />
      )}
    />
  );
}
