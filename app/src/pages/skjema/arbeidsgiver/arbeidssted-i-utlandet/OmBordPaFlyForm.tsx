import { TextField } from "@navikt/ds-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function OmBordPaFlyForm() {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const { control } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const erVanligHjemmebase = useWatch({
    name: "omBordPaFly.erVanligHjemmebase",
  });

  // Note: React Hook Form's FieldErrors cannot narrow discriminated unions.
  // This is a known design limitation (react-hook-form/react-hook-form#9287)
  // We use Controller's fieldState.error for type-safe error handling
  return (
    <div className="mt-6">
      <LandVelgerFormPart
        description={t("arbeidsstedIUtlandetSteg.hjemmebaseLandBeskrivelse")}
        formFieldName="omBordPaFly.hjemmebaseLand"
        label={t("arbeidsstedIUtlandetSteg.hjemmebaseLand")}
      />

      <Controller
        control={control}
        name="omBordPaFly.hjemmebaseNavn"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            className="mt-4"
            error={translateError(fieldState.error?.message)}
            label={t("arbeidsstedIUtlandetSteg.hjemmebaseNavn")}
            value={field.value ?? ""}
          />
        )}
      />

      <RadioGroupJaNeiFormPart
        className="mt-6"
        formFieldName="omBordPaFly.erVanligHjemmebase"
        legend={t("arbeidsstedIUtlandetSteg.erVanligHjemmebase")}
      />

      {erVanligHjemmebase === false && (
        <>
          <LandVelgerFormPart
            className="mt-4"
            formFieldName="omBordPaFly.vanligHjemmebaseLand"
            label={t("arbeidsstedIUtlandetSteg.vanligHjemmebaseLand")}
          />

          <Controller
            control={control}
            name="omBordPaFly.vanligHjemmebaseNavn"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={t("arbeidsstedIUtlandetSteg.vanligHjemmebaseNavn")}
                value={field.value ?? ""}
              />
            )}
          />
        </>
      )}
    </div>
  );
}
