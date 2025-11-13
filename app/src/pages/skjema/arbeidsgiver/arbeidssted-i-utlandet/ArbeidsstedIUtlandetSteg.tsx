import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useInvalidateArbeidsgiversSkjemaQuery } from "~/hooks/useInvalidateArbeidsgiversSkjemaQuery.ts";
import { postArbeidsstedIUtlandet } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { ArbeidsstedIUtlandetDto } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";
import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";
import { OffshoreForm } from "./OffshoreForm.tsx";
import { OmBordPaFlyForm } from "./OmBordPaFlyForm.tsx";
import { PaLandForm } from "./PaLandForm.tsx";
import { PaSkipForm } from "./PaSkipForm.tsx";

export const stepKey = "arbeidssted-i-utlandet";

export const arbeidsstedTypeOptions = [
  { value: "PA_LAND", labelKey: "arbeidsstedIUtlandetSteg.paLand" },
  { value: "OFFSHORE", labelKey: "arbeidsstedIUtlandetSteg.offshore" },
  { value: "PA_SKIP", labelKey: "arbeidsstedIUtlandetSteg.paSkip" },
  { value: "OM_BORD_PA_FLY", labelKey: "arbeidsstedIUtlandetSteg.omBordPaFly" },
];

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

function ArbeidsstedIUtlandetStegContent({ skjema }: ArbeidsgiverSkjemaProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidsgiverSkjemaQuery =
    useInvalidateArbeidsgiversSkjemaQuery();

  const lagretSkjemadataForSteg = skjema.data?.arbeidsstedIUtlandet;

  const formMethods = useForm({
    resolver: zodResolver(arbeidsstedIUtlandetSchema),
    defaultValues: {
      ...lagretSkjemadataForSteg,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = formMethods;

  const arbeidsstedType = watch("arbeidsstedType");

  const registerArbeidsstedMutation = useMutation({
    mutationFn: (data: ArbeidsstedIUtlandetFormData) => {
      const apiPayload = data as ArbeidsstedIUtlandetDto;
      return postArbeidsstedIUtlandet(skjema.id, apiPayload);
    },
    onSuccess: () => {
      invalidateArbeidsgiverSkjemaQuery(skjema.id);
      const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjema.id },
        });
      }
    },
    onError: () => {
      toast.error(t("felles.feil"));
    },
  });

  const onSubmit = (data: ArbeidsstedIUtlandetFormData) => {
    registerArbeidsstedMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
              loading: registerArbeidsstedMutation.isPending,
            },
          }}
        >
          <Select
            className="mt-4"
            error={translateError(errors.arbeidsstedType?.message)}
            label={t("arbeidsstedIUtlandetSteg.hvorSkalArbeidetUtfores")}
            style={{ width: "fit-content" }}
            {...register("arbeidsstedType")}
          >
            <option value="">
              {t("arbeidsstedIUtlandetSteg.velgArbeidssted")}
            </option>
            {arbeidsstedTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </Select>

          {arbeidsstedType === "PA_LAND" && <PaLandForm />}

          {arbeidsstedType === "OFFSHORE" && <OffshoreForm />}

          {arbeidsstedType === "PA_SKIP" && <PaSkipForm />}

          {arbeidsstedType === "OM_BORD_PA_FLY" && <OmBordPaFlyForm />}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

interface ArbeidsstedIUtlandetStegProps {
  id: string;
}

export function ArbeidsstedIUtlandetSteg({
  id,
}: ArbeidsstedIUtlandetStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <ArbeidsstedIUtlandetStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}
