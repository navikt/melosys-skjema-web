import { Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { Farvann } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function PaSkipForm() {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const { control } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const seilerI = useWatch({ name: "paSkip.seilerI" });

  // Note: React Hook Form's FieldErrors cannot narrow discriminated unions.
  // This is a known design limitation (react-hook-form/react-hook-form#9287)
  // We use Controller's fieldState.error for type-safe error handling
  return (
    <div className="mt-6">
      <Controller
        control={control}
        name="paSkip.navnPaSkip"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            error={translateError(fieldState.error?.message)}
            label={t("arbeidsstedIUtlandetSteg.navnPaSkip")}
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
            description={t(
              "arbeidsstedIUtlandetSteg.yrketTilArbeidstakerBeskrivelse",
            )}
            error={translateError(fieldState.error?.message)}
            label={t("arbeidsstedIUtlandetSteg.yrketTilArbeidstaker")}
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
            legend={t("arbeidsstedIUtlandetSteg.hvorSkalSkipetSeile")}
            onChange={field.onChange}
            value={field.value ?? ""}
          >
            <Radio value={Farvann.INTERNASJONALT_FARVANN}>
              {t("arbeidsstedIUtlandetSteg.internasjonaltFarvann")}
            </Radio>
            <Radio value={Farvann.TERRITORIALFARVANN}>
              {t("arbeidsstedIUtlandetSteg.territorialfarvann")}
            </Radio>
          </RadioGroup>
        )}
      />

      {seilerI === Farvann.INTERNASJONALT_FARVANN && (
        <LandVelgerFormPart
          className="mt-4"
          formFieldName="paSkip.flaggland"
          label={t("arbeidsstedIUtlandetSteg.flaggland")}
        />
      )}

      {seilerI === Farvann.TERRITORIALFARVANN && (
        <LandVelgerFormPart
          className="mt-4"
          formFieldName="paSkip.territorialfarvannLand"
          label={t("arbeidsstedIUtlandetSteg.hvilketLandsTerritorialfarvann")}
        />
      )}
    </div>
  );
}
