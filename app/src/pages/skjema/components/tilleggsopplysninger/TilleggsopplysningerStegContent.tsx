import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
import { TilleggsopplysningerDto } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { StegRekkefolgeItem } from "../Fremgangsindikator.tsx";
import { NesteStegKnapp } from "../NesteStegKnapp.tsx";
import { getNextStep, SkjemaSteg } from "../SkjemaSteg.tsx";
import {
  TilleggsopplysningerFormData,
  tilleggsopplysningerSchema,
} from "./tilleggsopplysningerStegSchema.ts";

export const stepKey = "tilleggsopplysninger";

interface TilleggsopplysningerStegProps {
  skjemaId: string;
  stegData?: TilleggsopplysningerDto;
  postTilleggsopplysninger: (
    skjemaId: string,
    data: TilleggsopplysningerDto,
  ) => Promise<void>;
  stegRekkefolge: StegRekkefolgeItem[];
}

export function TilleggsopplysningerStegContent({
  skjemaId,
  stegData,
  postTilleggsopplysninger,
  stegRekkefolge,
}: TilleggsopplysningerStegProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const { getFelt } = useSkjemaDefinisjon();

  // Hent felt-definisjoner - begge seksjonene har identiske labels
  const harFlereOpplysningerFelt = getFelt(
    "tilleggsopplysningerArbeidstaker",
    "harFlereOpplysningerTilSoknaden",
  );
  const tilleggsopplysningerFelt = getFelt(
    "tilleggsopplysningerArbeidstaker",
    "tilleggsopplysningerTilSoknad",
  );

  const formMethods = useForm({
    resolver: zodResolver(tilleggsopplysningerSchema),
    ...(stegData && { defaultValues: stegData }),
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
        skjemaId,
        data as TilleggsopplysningerDto,
      );
    },
    onSuccess: () => {
      const nextStep = getNextStep(stepKey, stegRekkefolge);
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjemaId },
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
            stegRekkefolge,
          }}
          nesteKnapp={
            <NesteStegKnapp
              loading={postTilleggsopplysningerMutation.isPending}
            />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harFlereOpplysningerTilSoknaden"
            legend={harFlereOpplysningerFelt.label}
          />

          {harFlereOpplysningerTilSoknaden && (
            <Textarea
              {...register("tilleggsopplysningerTilSoknad")}
              className="mt-4"
              error={translateError(
                errors.tilleggsopplysningerTilSoknad?.message,
              )}
              label={tilleggsopplysningerFelt.label}
            />
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
