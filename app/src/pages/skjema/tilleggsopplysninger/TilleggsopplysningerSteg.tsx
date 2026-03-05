import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postTilleggsopplysninger,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type { TilleggsopplysningerDto } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getTilleggsopplysninger } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import {
  type TilleggsopplysningerFormData,
  tilleggsopplysningerSchema,
} from "./tilleggsopplysningerStegSchema.ts";

export const stepKey = "tilleggsopplysninger";

export function TilleggsopplysningerSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => (
        <TilleggsopplysningerStegContent
          skjemaId={skjema.id}
          stegData={getTilleggsopplysninger(skjema)}
          stegRekkefolge={STEG_REKKEFOLGE[skjema.metadata.skjemadel]}
        />
      )}
    </SkjemaStegLoader>
  );
}

function TilleggsopplysningerStegContent({
  skjemaId,
  stegData,
  stegRekkefolge,
}: {
  skjemaId: string;
  stegData?: TilleggsopplysningerDto;
  stegRekkefolge: StegRekkefolgeItem[];
}) {
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
