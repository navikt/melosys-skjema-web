import { Radio, RadioGroup, Textarea, TextField } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function PaLandForm() {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const { control, watch } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const fastEllerVekslendeArbeidssted = watch(
    "paLand.fastEllerVekslendeArbeidssted",
  );

  // Note: React Hook Form's FieldErrors cannot narrow discriminated unions.
  // This is a known design limitation (react-hook-form/react-hook-form#9287)
  // We use Controller's fieldState.error for individual field errors when available
  return (
    <div className="mt-6">
      <Controller
        control={control}
        name="paLand.fastEllerVekslendeArbeidssted"
        render={({ field, fieldState }) => (
          <RadioGroup
            error={translateError(fieldState.error?.message)}
            legend={t(
              "arbeidsstedIUtlandetSteg.harFastArbeidsstedEllerVeksler",
            )}
            onChange={field.onChange}
            value={field.value ?? ""}
          >
            <Radio size="small" value="FAST">
              {t("arbeidsstedIUtlandetSteg.fastArbeidssted")}
            </Radio>
            <Radio size="small" value="VEKSLENDE">
              {t("arbeidsstedIUtlandetSteg.vekslerOfte")}
            </Radio>
          </RadioGroup>
        )}
      />

      {fastEllerVekslendeArbeidssted === "FAST" && (
        <div className="mt-4">
          <Controller
            control={control}
            name="paLand.fastArbeidssted.vegadresse"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={t("arbeidsstedIUtlandetSteg.vegadresse")}
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
                label={t("arbeidsstedIUtlandetSteg.nummer")}
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
                label={t("arbeidsstedIUtlandetSteg.postkode")}
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
                label={t("arbeidsstedIUtlandetSteg.bySted")}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      )}

      {fastEllerVekslendeArbeidssted === "VEKSLENDE" && (
        <Controller
          control={control}
          name="paLand.beskrivelseVekslende"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              className="mt-4"
              error={translateError(fieldState.error?.message)}
              label={t("arbeidsstedIUtlandetSteg.beskriv")}
              value={field.value ?? ""}
            />
          )}
        />
      )}

      <RadioGroupJaNeiFormPart
        className="mt-6"
        formFieldName="paLand.erHjemmekontor"
        legend={t("arbeidsstedIUtlandetSteg.erHjemmekontor")}
      />
    </div>
  );
}
