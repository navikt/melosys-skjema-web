import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import {
  ArbeidsgiversSkjemaDto,
  ArbeidstakersSkjemaDto,
  TilleggsopplysningerDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { StegRekkefolgeItem } from "../Fremgangsindikator.tsx";
import { getNextStep, SkjemaSteg } from "../SkjemaSteg.tsx";
import {
  TilleggsopplysningerFormData,
  tilleggsopplysningerSchema,
} from "./tilleggsopplysningerStegSchema.ts";

export const stepKey = "tilleggsopplysninger";

interface TilleggsopplysningerStegProps {
  skjema: ArbeidsgiversSkjemaDto | ArbeidstakersSkjemaDto;
  postTilleggsopplysninger: (
    skjemaId: string,
    data: TilleggsopplysningerDto,
  ) => Promise<void>;
  invalidateSkjemaQuery: (skjemaId: string) => void;
  stegRekkefolge: StegRekkefolgeItem[];
}

export function TilleggsopplysningerStegContent({
  skjema,
  postTilleggsopplysninger,
  invalidateSkjemaQuery,
  stegRekkefolge,
}: TilleggsopplysningerStegProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const lagretSkjemadataForSteg = skjema.data?.tilleggsopplysninger;

  const formMethods = useForm({
    resolver: zodResolver(tilleggsopplysningerSchema),
    ...(lagretSkjemadataForSteg && { defaultValues: lagretSkjemadataForSteg }),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = formMethods;
  const harFlereOpplysningerTilSoknaden = useWatch({
    control,
    name: "harFlereOpplysningerTilSoknaden",
  });

  const postTilleggsopplysningerMutation = useMutation({
    mutationFn: (data: TilleggsopplysningerFormData) => {
      return postTilleggsopplysninger(
        skjema.id,
        data as TilleggsopplysningerDto,
      );
    },
    onSuccess: () => {
      invalidateSkjemaQuery(skjema.id);
      const nextStep = getNextStep(stepKey, stegRekkefolge);
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

  const onSubmit = (data: TilleggsopplysningerFormData) => {
    postTilleggsopplysningerMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
              loading: postTilleggsopplysningerMutation.isPending,
            },
            stegRekkefolge,
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harFlereOpplysningerTilSoknaden"
            legend={t(
              "tilleggsopplysningerSteg.harDuNoenFlereOpplysningerTilSoknaden",
            )}
          />

          {harFlereOpplysningerTilSoknaden && (
            <Textarea
              {...register("tilleggsopplysningerTilSoknad")}
              className="mt-4"
              error={translateError(
                errors.tilleggsopplysningerTilSoknad?.message,
              )}
              label={t(
                "tilleggsopplysningerSteg.beskriveFlereOpplysningerTilSoknaden",
              )}
            />
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
