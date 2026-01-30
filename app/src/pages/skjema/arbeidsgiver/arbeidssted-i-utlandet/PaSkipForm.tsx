import { Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
import { Farvann } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";
import { NavnPaVirksomhetFormPart } from "./NavnPaVirksomhetFormPart.tsx";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function PaSkipForm() {
  const translateError = useTranslateError();
  const { getSeksjon } = useSkjemaDefinisjon();
  const felter = getSeksjon("arbeidsstedPaSkip").felter;
  const { control } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const seilerI = useWatch({ name: "paSkip.seilerI" });

  // Note: React Hook Form's FieldErrors cannot narrow discriminated unions.
  // This is a known design limitation (react-hook-form/react-hook-form#9287)
  // We use Controller's fieldState.error for type-safe error handling
  return (
    <div className="mt-6">
      <NavnPaVirksomhetFormPart formFieldName="paSkip.navnPaVirksomhet" />

      <Controller
        control={control}
        name="paSkip.navnPaSkip"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            className="mt-4"
            error={translateError(fieldState.error?.message)}
            label={felter.navnPaSkip.label}
            value={field.value ?? ""}
          />
        )}
      />

      <Controller
        control={control}
        name="paSkip.yrketTilArbeidstaker"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            className="mt-4"
            description={felter.yrketTilArbeidstaker.hjelpetekst}
            error={translateError(fieldState.error?.message)}
            label={felter.yrketTilArbeidstaker.label}
            value={field.value ?? ""}
          />
        )}
      />

      <Controller
        control={control}
        name="paSkip.seilerI"
        render={({ field, fieldState }) => (
          <RadioGroup
            className="mt-4"
            error={translateError(fieldState.error?.message)}
            legend={felter.seilerI.label}
            onChange={field.onChange}
            value={field.value ?? ""}
          >
            {felter.seilerI.alternativer.map((alt) => (
              <Radio key={alt.verdi} value={alt.verdi}>
                {alt.label}
              </Radio>
            ))}
          </RadioGroup>
        )}
      />

      {seilerI === Farvann.INTERNASJONALT_FARVANN && (
        <LandVelgerFormPart
          className="mt-4"
          formFieldName="paSkip.flaggland"
          label={felter.flaggland.label}
        />
      )}

      {seilerI === Farvann.TERRITORIALFARVANN && (
        <LandVelgerFormPart
          className="mt-4"
          formFieldName="paSkip.territorialfarvannLand"
          label={felter.territorialfarvannLand.label}
        />
      )}
    </div>
  );
}
