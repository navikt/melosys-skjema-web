import { Radio, RadioGroup, Textarea, TextField } from "@navikt/ds-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
import { FastEllerVekslendeArbeidssted } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";
import { NavnPaVirksomhetFormPart } from "./NavnPaVirksomhetFormPart.tsx";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function PaLandForm() {
  const translateError = useTranslateError();
  const { getSeksjon } = useSkjemaDefinisjon();
  const felter = getSeksjon("arbeidsstedPaLand").felter;
  const { control } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const fastEllerVekslendeArbeidssted = useWatch({
    name: "paLand.fastEllerVekslendeArbeidssted",
  });

  // Note: React Hook Form's FieldErrors cannot narrow discriminated unions.
  // This is a known design limitation (react-hook-form/react-hook-form#9287)
  // We use Controller's fieldState.error for individual field errors when available
  return (
    <div className="mt-6">
      <NavnPaVirksomhetFormPart formFieldName="paLand.navnPaVirksomhet" />

      <Controller
        control={control}
        name="paLand.fastEllerVekslendeArbeidssted"
        render={({ field, fieldState }) => (
          <RadioGroup
            className="mt-4"
            error={translateError(fieldState.error?.message)}
            legend={felter.fastEllerVekslendeArbeidssted.label}
            onChange={field.onChange}
            value={field.value ?? ""}
          >
            {felter.fastEllerVekslendeArbeidssted.alternativer.map((alt) => (
              <Radio key={alt.verdi} size="small" value={alt.verdi}>
                {alt.label}
              </Radio>
            ))}
          </RadioGroup>
        )}
      />

      {fastEllerVekslendeArbeidssted === FastEllerVekslendeArbeidssted.FAST && (
        <div className="mt-4">
          <Controller
            control={control}
            name="paLand.fastArbeidssted.vegadresse"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={felter.vegadresse.label}
                value={field.value ?? ""}
              />
            )}
          />
          <Controller
            control={control}
            name="paLand.fastArbeidssted.nummer"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={felter.nummer.label}
                value={field.value ?? ""}
              />
            )}
          />
          <Controller
            control={control}
            name="paLand.fastArbeidssted.postkode"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={felter.postkode.label}
                value={field.value ?? ""}
              />
            )}
          />
          <Controller
            control={control}
            name="paLand.fastArbeidssted.bySted"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={felter.bySted.label}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      )}

      {fastEllerVekslendeArbeidssted ===
        FastEllerVekslendeArbeidssted.VEKSLENDE && (
        <Controller
          control={control}
          name="paLand.beskrivelseVekslende"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              className="mt-4"
              error={translateError(fieldState.error?.message)}
              label={felter.beskrivelseVekslende.label}
              value={field.value ?? ""}
            />
          )}
        />
      )}

      <RadioGroupJaNeiFormPart
        className="mt-6"
        formFieldName="paLand.erHjemmekontor"
        legend={felter.erHjemmekontor.label}
      />
    </div>
  );
}
