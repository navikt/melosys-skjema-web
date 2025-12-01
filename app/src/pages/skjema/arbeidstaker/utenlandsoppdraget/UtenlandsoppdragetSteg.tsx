import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { DatePickerFormPart } from "~/components/DatePickerFormPart.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { useInvalidateArbeidstakersSkjemaQuery } from "~/hooks/useInvalidateArbeidstakersSkjemaQuery.ts";
import { postUtenlandsoppdragetArbeidstaker } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidstakersSkjemaDto,
  UtenlandsoppdragetArbeidstakersDelDto,
} from "~/types/melosysSkjemaTypes.ts";

import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { utenlandsoppdragSchema } from "./utenlandsoppdragetStegSchema.ts";

export const stepKey = "utenlandsoppdraget";

// Date range constants for assignment period selection
const YEARS_BACK_FROM_CURRENT = 1;
const YEARS_FORWARD_FROM_CURRENT = 5;

interface UtenlandsoppdragetStegContentProps {
  skjema: ArbeidstakersSkjemaDto;
}

function UtenlandsoppdragetStegContent({
  skjema,
}: UtenlandsoppdragetStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidstakerSkjemaQuery =
    useInvalidateArbeidstakersSkjemaQuery();

  const lagretSkjemadataForSteg = skjema.data?.utenlandsoppdraget;

  const formMethods = useForm({
    resolver: zodResolver(utenlandsoppdragSchema),
    ...(lagretSkjemadataForSteg && { defaultValues: lagretSkjemadataForSteg }),
  });

  const { handleSubmit } = formMethods;

  const dateLimits = {
    fromDate: new Date(
      new Date().getFullYear() - YEARS_BACK_FROM_CURRENT,
      0,
      1,
    ),
    toDate: new Date(
      new Date().getFullYear() + YEARS_FORWARD_FROM_CURRENT,
      11,
      31,
    ),
  };

  const registerUtenlandsoppdragMutation = useMutation({
    mutationFn: (data: UtenlandsoppdragetArbeidstakersDelDto) => {
      return postUtenlandsoppdragetArbeidstaker(skjema.id, data);
    },
    onSuccess: async () => {
      await invalidateArbeidstakerSkjemaQuery(skjema.id);
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

  const onSubmit = (data: UtenlandsoppdragetArbeidstakersDelDto) => {
    registerUtenlandsoppdragMutation.mutate(data);
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
              loading: registerUtenlandsoppdragMutation.isPending,
            },
          }}
        >
          <LandVelgerFormPart
            className="mt-4"
            formFieldName="utsendelsesLand"
            label={t(
              "utenlandsoppdragetArbeidstakerSteg.iHvilketLandSkalDuUtforeArbeid",
            )}
          />

          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold">
              {t("utenlandsoppdragetArbeidstakerSteg.utsendingsperiode")}
            </h3>

            <DatePickerFormPart
              className="mt-4"
              defaultSelected={
                lagretSkjemadataForSteg?.utsendelseFraDato
                  ? new Date(lagretSkjemadataForSteg.utsendelseFraDato)
                  : undefined
              }
              formFieldName="utsendelseFraDato"
              label={t("utenlandsoppdragetArbeidstakerSteg.fraDato")}
              {...dateLimits}
            />

            <DatePickerFormPart
              className="mt-4"
              defaultSelected={
                lagretSkjemadataForSteg?.utsendelseTilDato
                  ? new Date(lagretSkjemadataForSteg.utsendelseTilDato)
                  : undefined
              }
              description={t(
                "utenlandsoppdragetArbeidstakerSteg.oppgiOmtrentligDatoHvisDuIkkeVetNoyaktigDato",
              )}
              formFieldName="utsendelseTilDato"
              label={t("utenlandsoppdragetArbeidstakerSteg.tilDato")}
              {...dateLimits}
            />
          </div>
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

interface UtenlandsoppdragetStegProps {
  id: string;
}

export function UtenlandsoppdragetSteg({ id }: UtenlandsoppdragetStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <UtenlandsoppdragetStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}
