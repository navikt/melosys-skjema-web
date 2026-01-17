import { TextField } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";

import { getFelt } from "~/constants/skjemaDefinisjonA1";
import { useTranslateError } from "~/utils/translation.ts";

type NavnPaVirksomhetFormPartProps = {
  formFieldName: string;
  className?: string;
};

// Alle arbeidssted-seksjoner har navnPaVirksomhet med samme label, så vi velger en vilkårlig
const navnPaVirksomhetFelt = getFelt("arbeidsstedPaLand", "navnPaVirksomhet");

export function NavnPaVirksomhetFormPart({
  formFieldName,
  className,
}: NavnPaVirksomhetFormPartProps) {
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
          label={navnPaVirksomhetFelt.label}
          value={field.value ?? ""}
        />
      )}
    />
  );
}
