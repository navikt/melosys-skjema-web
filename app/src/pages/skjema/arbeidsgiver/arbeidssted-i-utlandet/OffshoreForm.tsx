import { Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";
import { NavnPaVirksomhetFormPart } from "./NavnPaVirksomhetFormPart.tsx";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function OffshoreForm() {
  const translateError = useTranslateError();
  const { getSeksjon } = useSkjemaDefinisjon();
  const felter = getSeksjon("arbeidsstedOffshore").felter;
  const { control } = useFormContext<ArbeidsstedIUtlandetFormData>();

  // Note: React Hook Form's FieldErrors cannot narrow discriminated unions.
  // This is a known design limitation (react-hook-form/react-hook-form#9287)
  // We use Controller's fieldState.error for type-safe error handling
  return (
    <div className="mt-6">
      <NavnPaVirksomhetFormPart formFieldName="offshore.navnPaVirksomhet" />

      <Controller
        control={control}
        name="offshore.navnPaInnretning"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            className="mt-4"
            error={translateError(fieldState.error?.message)}
            label={felter.navnPaInnretning.label}
            value={field.value ?? ""}
          />
        )}
      />

      <Controller
        control={control}
        name="offshore.typeInnretning"
        render={({ field, fieldState }) => (
          <RadioGroup
            className="mt-4"
            error={translateError(fieldState.error?.message)}
            legend={felter.typeInnretning.label}
            onChange={field.onChange}
            value={field.value ?? ""}
          >
            {felter.typeInnretning.alternativer.map((alt) => (
              <Radio key={alt.verdi} value={alt.verdi}>
                {alt.label}
              </Radio>
            ))}
          </RadioGroup>
        )}
      />

      <LandVelgerFormPart
        className="mt-4"
        formFieldName="offshore.sokkelLand"
        label={felter.sokkelLand.label}
      />
    </div>
  );
}
