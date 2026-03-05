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
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postSkatteforholdOgInntekt,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type { SkatteforholdOgInntektDto } from "~/types/melosysSkjemaTypes.ts";
import { getFieldError } from "~/utils/formErrors.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import {
  isArbeidstakerData,
  isCombinedData,
  type SkjemaData,
} from "../types.ts";
import { skatteforholdOgInntektSchema } from "./skatteforholdOgInntektStegSchema.ts";

export const stepKey = "skatteforhold-og-inntekt";

function getSkatteforholdOgInntekt(
  data?: SkjemaData,
): SkatteforholdOgInntektDto | undefined {
  if (!data) return undefined;
  if (isArbeidstakerData(data)) return data.skatteforholdOgInntekt;
  if (isCombinedData(data))
    return data.arbeidstakersData?.skatteforholdOgInntekt;
  return undefined;
}

type SkatteforholdOgInntektFormData = z.infer<
  typeof skatteforholdOgInntektSchema
>;

function SkatteforholdOgInntektStegContent({
  skjemaId,
  stegData,
  stegRekkefolge,
}: {
  skjemaId: string;
  stegData?: SkatteforholdOgInntektDto;
  stegRekkefolge: StegRekkefolgeItem[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidstakerSkjemaQuery = useInvalidateSkjemaQuery();
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

  const formMethods = useForm({
    resolver: zodResolver(skatteforholdOgInntektSchema),
    ...(stegData && { defaultValues: stegData }),
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
        skjemaId,
        data as SkatteforholdOgInntektDto,
      );
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjemaId);
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

  const onSubmit = (data: SkatteforholdOgInntektFormData) => {
    postSkatteforholdMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            stegRekkefolge: stegRekkefolge,
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
            description={mottarPengestotteFelt.hjelpetekst}
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

export function SkatteforholdOgInntektSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => (
        <SkatteforholdOgInntektStegContent
          skjemaId={skjema.id}
          stegData={getSkatteforholdOgInntekt(skjema.data)}
          stegRekkefolge={STEG_REKKEFOLGE[skjema.metadata.skjemadel]}
        />
      )}
    </SkjemaStegLoader>
  );
}
