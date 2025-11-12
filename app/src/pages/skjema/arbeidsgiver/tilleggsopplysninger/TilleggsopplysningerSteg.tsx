import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useInvalidateArbeidsgiversSkjemaQuery } from "~/hooks/useInvalidateArbeidsgiversSkjemaQuery.ts";
import { postTilleggsopplysningerArbeidsgiver } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { TilleggsopplysningerDto } from "~/types/melosysSkjemaTypes.ts";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";
import { tilleggsopplysningerSchema } from "./tilleggsopplysningerStegSchema.ts";

export const stepKey = "tilleggsopplysninger";

function TilleggsopplysningerStegContent({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidsgiverSkjemaQuery =
    useInvalidateArbeidsgiversSkjemaQuery();

  const lagretSkjemadataForSteg = skjema.data?.tilleggsopplysninger;

  const formMethods = useForm({
    resolver: zodResolver(tilleggsopplysningerSchema),
    defaultValues: {
      ...lagretSkjemadataForSteg,
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = formMethods;
  const harFlereOpplysningerTilSoknaden = watch(
    "harFlereOpplysningerTilSoknaden",
  );

  const postTilleggsopplysningerMutation = useMutation({
    mutationFn: (data: TilleggsopplysningerDto) => {
      return postTilleggsopplysningerArbeidsgiver(skjema.id, data);
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

  const onSubmit = (data: TilleggsopplysningerDto) => {
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
            stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
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
              error={errors.tilleggsopplysningerTilSoknad?.message}
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

interface TilleggsopplysningerStegProps {
  id: string;
}

export function TilleggsopplysningerSteg({
  id,
}: TilleggsopplysningerStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <TilleggsopplysningerStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}
