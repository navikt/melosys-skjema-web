import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useInvalidateArbeidsgiversSkjemaQuery } from "~/hooks/useInvalidateArbeidsgiversSkjemaQuery.ts";
import { postArbeidsstedIUtlandet } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidsstedIUtlandetDto,
  ArbeidsstedType,
} from "~/types/melosysSkjemaTypes.ts";
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
  {
    value: ArbeidsstedType.PA_LAND,
    labelKey: "arbeidsstedIUtlandetSteg.paLand",
  },
  {
    value: ArbeidsstedType.OFFSHORE,
    labelKey: "arbeidsstedIUtlandetSteg.offshore",
  },
  {
    value: ArbeidsstedType.PA_SKIP,
    labelKey: "arbeidsstedIUtlandetSteg.paSkip",
  },
  {
    value: ArbeidsstedType.OM_BORD_PA_FLY,
    labelKey: "arbeidsstedIUtlandetSteg.omBordPaFly",
  },
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
    ...(lagretSkjemadataForSteg && { defaultValues: lagretSkjemadataForSteg }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = formMethods;

  const arbeidsstedType = useWatch({ control, name: "arbeidsstedType" });

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
          }}
          nesteKnapp={
            <NesteStegKnapp loading={registerArbeidsstedMutation.isPending} />
          }
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

          {arbeidsstedType === ArbeidsstedType.PA_LAND && <PaLandForm />}

          {arbeidsstedType === ArbeidsstedType.OFFSHORE && <OffshoreForm />}

          {arbeidsstedType === ArbeidsstedType.PA_SKIP && <PaSkipForm />}

          {arbeidsstedType === ArbeidsstedType.OM_BORD_PA_FLY && (
            <OmBordPaFlyForm />
          )}
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
