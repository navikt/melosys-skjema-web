import { Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function PaSkipForm() {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const seilerI = watch("paSkip.seilerI");

  return (
    <div className="mt-6">
      <TextField
        error={translateError(errors.paSkip?.navnPaSkip?.message)}
        label={t("arbeidsstedIUtlandetSteg.navnPaSkip")}
        {...register("paSkip.navnPaSkip")}
      />

      <TextField
        className="mt-4"
        description={t(
          "arbeidsstedIUtlandetSteg.yrketTilArbeidstakerBeskrivelse",
        )}
        error={translateError(errors.paSkip?.yrketTilArbeidstaker?.message)}
        label={t("arbeidsstedIUtlandetSteg.yrketTilArbeidstaker")}
        {...register("paSkip.yrketTilArbeidstaker")}
      />

      <Controller
        control={control}
        name="paSkip.seilerI"
        render={({ field, fieldState }) => (
          <RadioGroup
            className="mt-4"
            error={translateError(fieldState.error?.message)}
            legend={t("arbeidsstedIUtlandetSteg.hvorSkalSkipetSeile")}
            onChange={field.onChange}
            value={field.value ?? ""}
          >
            <Radio value="INTERNASJONALT_FARVANN">
              {t("arbeidsstedIUtlandetSteg.internasjonaltFarvann")}
            </Radio>
            <Radio value="TERRITORIALFARVANN">
              {t("arbeidsstedIUtlandetSteg.territorialfarvann")}
            </Radio>
          </RadioGroup>
        )}
      />

      {seilerI === "INTERNASJONALT_FARVANN" && (
        <LandVelgerFormPart
          className="mt-4"
          formFieldName="paSkip.flaggland"
          label={t("arbeidsstedIUtlandetSteg.flaggland")}
        />
      )}

      {seilerI === "TERRITORIALFARVANN" && (
        <LandVelgerFormPart
          className="mt-4"
          formFieldName="paSkip.territorialfarvannLand"
          label={t("arbeidsstedIUtlandetSteg.hvilketLandsTerritorialfarvann")}
        />
      )}
    </div>
  );
}
