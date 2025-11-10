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
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const fastEllerVekslendeArbeidssted = watch(
    "paLand.fastEllerVekslendeArbeidssted",
  );

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
          <TextField
            className="mt-4"
            error={translateError(
              errors.paLand?.fastArbeidssted?.vegadresse?.message,
            )}
            label={t("arbeidsstedIUtlandetSteg.vegadresse")}
            {...register("paLand.fastArbeidssted.vegadresse")}
          />
          <TextField
            className="mt-4"
            error={translateError(
              errors.paLand?.fastArbeidssted?.nummer?.message,
            )}
            label={t("arbeidsstedIUtlandetSteg.nummer")}
            {...register("paLand.fastArbeidssted.nummer")}
          />
          <TextField
            className="mt-4"
            error={translateError(
              errors.paLand?.fastArbeidssted?.postkode?.message,
            )}
            label={t("arbeidsstedIUtlandetSteg.postkode")}
            {...register("paLand.fastArbeidssted.postkode")}
          />
          <TextField
            className="mt-4"
            error={translateError(
              errors.paLand?.fastArbeidssted?.bySted?.message,
            )}
            label={t("arbeidsstedIUtlandetSteg.bySted")}
            {...register("paLand.fastArbeidssted.bySted")}
          />
        </div>
      )}

      {fastEllerVekslendeArbeidssted === "VEKSLENDE" && (
        <Textarea
          className="mt-4"
          error={translateError(errors.paLand?.beskrivelseVekslende?.message)}
          label={t("arbeidsstedIUtlandetSteg.beskriv")}
          {...register("paLand.beskrivelseVekslende")}
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
