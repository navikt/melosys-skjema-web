import { TextField } from "@navikt/ds-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";
import { NavnPaVirksomhetFormPart } from "./NavnPaVirksomhetFormPart.tsx";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function OmBordPaFlyForm() {
  const translateError = useTranslateError();
  const { getSeksjon } = useSkjemaDefinisjon();
  const felter = getSeksjon("arbeidsstedOmBordPaFly").felter;
  const { control } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const erVanligHjemmebase = useWatch({
    name: "omBordPaFly.erVanligHjemmebase",
  });

  // Note: React Hook Form's FieldErrors cannot narrow discriminated unions.
  // This is a known design limitation (react-hook-form/react-hook-form#9287)
  // We use Controller's fieldState.error for type-safe error handling
  return (
    <div className="mt-6">
      <NavnPaVirksomhetFormPart formFieldName="omBordPaFly.navnPaVirksomhet" />

      <LandVelgerFormPart
        className="mt-4"
        description={felter.hjemmebaseLand.hjelpetekst}
        formFieldName="omBordPaFly.hjemmebaseLand"
        label={felter.hjemmebaseLand.label}
      />

      <Controller
        control={control}
        name="omBordPaFly.hjemmebaseNavn"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            className="mt-4"
            error={translateError(fieldState.error?.message)}
            label={felter.hjemmebaseNavn.label}
            value={field.value ?? ""}
          />
        )}
      />

      <RadioGroupJaNeiFormPart
        className="mt-6"
        formFieldName="omBordPaFly.erVanligHjemmebase"
        legend={felter.erVanligHjemmebase.label}
      />

      {erVanligHjemmebase === false && (
        <>
          <LandVelgerFormPart
            className="mt-4"
            formFieldName="omBordPaFly.vanligHjemmebaseLand"
            label={felter.vanligHjemmebaseLand.label}
          />

          <Controller
            control={control}
            name="omBordPaFly.vanligHjemmebaseNavn"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={felter.vanligHjemmebaseNavn.label}
                value={field.value ?? ""}
              />
            )}
          />
        </>
      )}
    </div>
  );
}
