import { TextField } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";
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
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const erVanligHjemmebase = watch("omBordPaFly.erVanligHjemmebase");

  return (
    <div className="mt-6">
      <LandVelgerFormPart
        description={t("arbeidsstedIUtlandetSteg.hjemmebaseLandBeskrivelse")}
        formFieldName="omBordPaFly.hjemmebaseLand"
        label={t("arbeidsstedIUtlandetSteg.hjemmebaseLand")}
      />

      <TextField
        className="mt-4"
        error={translateError(errors.omBordPaFly?.hjemmebaseNavn?.message)}
        label={t("arbeidsstedIUtlandetSteg.hjemmebaseNavn")}
        {...register("omBordPaFly.hjemmebaseNavn")}
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

          <TextField
            className="mt-4"
            error={translateError(
              errors.omBordPaFly?.vanligHjemmebaseNavn?.message,
            )}
            label={t("arbeidsstedIUtlandetSteg.vanligHjemmebaseNavn")}
            {...register("omBordPaFly.vanligHjemmebaseNavn")}
          />
        </>
      )}
    </div>
  );
}
