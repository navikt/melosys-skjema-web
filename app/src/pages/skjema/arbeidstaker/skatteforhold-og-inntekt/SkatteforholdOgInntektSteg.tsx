import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea, TextField } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useInvalidateArbeidstakersSkjemaQuery } from "~/hooks/useInvalidateArbeidstakersSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
import { postSkatteforholdOgInntekt } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidstakersSkjemaDto,
  SkatteforholdOgInntektDto,
} from "~/types/melosysSkjemaTypes.ts";
import { getFieldError } from "~/utils/formErrors.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { skatteforholdOgInntektSchema } from "./skatteforholdOgInntektStegSchema.ts";

export const stepKey = "skatteforhold-og-inntekt";

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
  const invalidateArbeidstakerSkjemaQuery =
    useInvalidateArbeidstakersSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

  const erSkattepliktigFelt = getFelt(
    "skatteforholdOgInntekt",
    "erSkattepliktigTilNorgeIHeleutsendingsperioden",
  );
  const mottarPengestotteFelt = getFelt(
    "skatteforholdOgInntekt",
    "mottarPengestotteFraAnnetEosLandEllerSveits",
  );
  const landSomUtbetalerFelt = getFelt(
    "skatteforholdOgInntekt",
    "landSomUtbetalerPengestotte",
  );
  const belopFelt = getFelt(
    "skatteforholdOgInntekt",
    "pengestotteSomMottasFraAndreLandBelop",
  );
  const beskrivelseFelt = getFelt(
    "skatteforholdOgInntekt",
    "pengestotteSomMottasFraAndreLandBeskrivelse",
  );

  const lagretSkjemadataForSteg = skjema.data?.skatteforholdOgInntekt;

  const formMethods = useForm({
    resolver: zodResolver(skatteforholdOgInntektSchema),
    ...(lagretSkjemadataForSteg && { defaultValues: lagretSkjemadataForSteg }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = formMethods;

  const mottarPengestotteFraAnnetEosLandEllerSveits = useWatch({
    control,
    name: "mottarPengestotteFraAnnetEosLandEllerSveits",
  });

  const postSkatteforholdMutation = useMutation({
    mutationFn: (data: SkatteforholdOgInntektFormData) => {
      return postSkatteforholdOgInntekt(
        skjema.id,
        data as SkatteforholdOgInntektDto,
      );
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjema.id);
      const nextStep = getNextStep(stepKey, ARBEIDSTAKER_STEG_REKKEFOLGE);
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
          }}
          nesteKnapp={
            <NesteStegKnapp loading={postSkatteforholdMutation.isPending} />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="erSkattepliktigTilNorgeIHeleutsendingsperioden"
            legend={erSkattepliktigFelt.label}
          />

          <RadioGroupJaNeiFormPart
            className="mt-4"
            description={t(
              "skatteforholdOgInntektSteg.mottarDuPengestotteBeskrivelse",
            )}
            formFieldName="mottarPengestotteFraAnnetEosLandEllerSveits"
            legend={mottarPengestotteFelt.label}
          />

          {mottarPengestotteFraAnnetEosLandEllerSveits && (
            <>
              <LandVelgerFormPart
                className="mt-4"
                formFieldName="landSomUtbetalerPengestotte"
                label={landSomUtbetalerFelt.label}
              />

              <TextField
                className="mt-4"
                description={belopFelt.hjelpetekst}
                error={translateError(
                  getFieldError(
                    errors,
                    "pengestotteSomMottasFraAndreLandBelop",
                  ),
                )}
                inputMode="decimal"
                label={belopFelt.label}
                {...register("pengestotteSomMottasFraAndreLandBelop")}
              />

              <Textarea
                className="mt-4"
                error={translateError(
                  getFieldError(
                    errors,
                    "pengestotteSomMottasFraAndreLandBeskrivelse",
                  ),
                )}
                label={beskrivelseFelt.label}
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
