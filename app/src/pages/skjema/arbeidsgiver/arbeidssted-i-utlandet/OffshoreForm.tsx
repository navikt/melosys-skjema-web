import { Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { TypeInnretning } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";
import { NavnPaVirksomhetFormPart } from "./NavnPaVirksomhetFormPart.tsx";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function OffshoreForm() {
  const { t } = useTranslation();
  const translateError = useTranslateError();
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
            label={t("arbeidsstedIUtlandetSteg.navnPaInnretning")}
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
            legend={t("arbeidsstedIUtlandetSteg.hvilkenTypeInnretning")}
            onChange={field.onChange}
            value={field.value ?? ""}
          >
            <Radio value={TypeInnretning.PLATTFORM_ELLER_ANNEN_FAST_INNRETNING}>
              {t("arbeidsstedIUtlandetSteg.plattformEllerFast")}
            </Radio>
            <Radio
              value={TypeInnretning.BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING}
            >
              {t("arbeidsstedIUtlandetSteg.boreskipEllerFlyttbar")}
            </Radio>
          </RadioGroup>
        )}
      />

      <LandVelgerFormPart
        className="mt-4"
        formFieldName="offshore.sokkelLand"
        label={t("arbeidsstedIUtlandetSteg.hvilketLandsSokkel")}
      />
    </div>
  );
}
