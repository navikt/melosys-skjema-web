import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea, TextField } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { postSkatteforholdOgInntekt } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidstakersSkjemaDto,
  SkatteforholdOgInntektDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidstakerStegLoader } from "./components/ArbeidstakerStegLoader.tsx";
import { skatteforholdOgInntektSchema } from "./skatteforholdOgInntektStegSchema.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "skatteforhold-og-inntekt";

type SkatteforholdOgInntektFormData = z.infer<
  typeof skatteforholdOgInntektSchema
>;

interface SkatteforholdOgInntektStegContentProps {
  skjema: ArbeidstakersSkjemaDto;
}

function SkatteforholdOgInntektStegContent({
  skjema,
}: SkatteforholdOgInntektStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const lagretSkjemadataForSteg = skjema.data?.skatteforholdOgInntekt;

  const formMethods = useForm({
    resolver: zodResolver(skatteforholdOgInntektSchema),
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

  const mottarPengestotteFraAnnetEosLandEllerSveits = watch(
    "mottarPengestotteFraAnnetEosLandEllerSveits",
  );

  const postSkatteforholdMutation = useMutation({
    mutationFn: (data: SkatteforholdOgInntektFormData) => {
      return postSkatteforholdOgInntekt(
        skjema.id,
        data as SkatteforholdOgInntektDto,
      );
    },
    onSuccess: () => {
      const nextStep = getNextStep(stepKey, ARBEIDSTAKER_STEG_REKKEFOLGE);
      if (nextStep) {
        const nextRoute = nextStep.route.replace("$id", skjema.id);
        navigate({ to: nextRoute });
      }
    },
    onError: () => {
      toast.error(t("felles.feil"));
    },
  });

  const onSubmit = (data: SkatteforholdOgInntektFormData) => {
    postSkatteforholdMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
              loading: postSkatteforholdMutation.isPending,
            },
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="erSkattepliktigTilNorgeIHeleutsendingsperioden"
            legend={t(
              "skatteforholdOgInntektSteg.erDuSkattepliktigTilNorgeIHeleUtsendingsperioden",
            )}
          />

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="mottarPengestotteFraAnnetEosLandEllerSveits"
            legend={t(
              "skatteforholdOgInntektSteg.mottarDuPengestotteFraEtAnnetEosLandEllerSveits",
            )}
          />

          {mottarPengestotteFraAnnetEosLandEllerSveits === true && (
            <>
              <LandVelgerFormPart
                className="mt-4"
                formFieldName="landSomUtbetalerPengestotte"
                label={t(
                  "skatteforholdOgInntektSteg.fraHvilketLandMottarDuPengestotte",
                )}
              />

              <TextField
                className="mt-4"
                description={t(
                  "skatteforholdOgInntektSteg.oppgiBelopetINorskeKroner",
                )}
                error={translateError(
                  errors.pengestotteSomMottasFraAndreLandBelop?.message,
                )}
                inputMode="decimal"
                label={t(
                  "skatteforholdOgInntektSteg.hvorMyePengerMottarDuBruttoPerManed",
                )}
                {...register("pengestotteSomMottasFraAndreLandBelop")}
              />

              <Textarea
                className="mt-4"
                error={translateError(
                  errors.pengestotteSomMottasFraAndreLandBeskrivelse?.message,
                )}
                label={t(
                  "skatteforholdOgInntektSteg.hvaSlangsPengestotteMottarDu",
                )}
                {...register("pengestotteSomMottasFraAndreLandBeskrivelse")}
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

interface SkatteforholdOgInntektStegProps {
  id: string;
}

export function SkatteforholdOgInntektSteg({
  id,
}: SkatteforholdOgInntektStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <SkatteforholdOgInntektStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}
