import { Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

export function OffshoreForm() {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ArbeidsstedIUtlandetFormData>();

  return (
    <div className="mt-6">
      <TextField
        error={translateError(errors.offshore?.navnPaInnretning?.message)}
        label={t("arbeidsstedIUtlandetSteg.navnPaInnretning")}
        {...register("offshore.navnPaInnretning")}
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
            <Radio value="PLATTFORM_ELLER_ANNEN_FAST_INNRETNING">
              {t("arbeidsstedIUtlandetSteg.plattformEllerFast")}
            </Radio>
            <Radio value="BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING">
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
