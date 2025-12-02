import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { PeriodeFormPart } from "~/components/date/PeriodeFormPart.tsx";
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

          <PeriodeFormPart
            className="mt-6"
            defaultFraDato={
              lagretSkjemadataForSteg?.utsendelsePeriode?.fraDato
                ? new Date(lagretSkjemadataForSteg.utsendelsePeriode.fraDato)
                : undefined
            }
            defaultTilDato={
              lagretSkjemadataForSteg?.utsendelsePeriode?.tilDato
                ? new Date(lagretSkjemadataForSteg.utsendelsePeriode.tilDato)
                : undefined
            }
            formFieldName="utsendelsePeriode"
            fraDatoLabel={t("utenlandsoppdragetArbeidstakerSteg.fraDato")}
            label={t("utenlandsoppdragetArbeidstakerSteg.utsendingsperiode")}
            tilDatoDescription={t(
              "utenlandsoppdragetArbeidstakerSteg.oppgiOmtrentligDatoHvisDuIkkeVetNoyaktigDato",
            )}
            tilDatoLabel={t("utenlandsoppdragetArbeidstakerSteg.tilDato")}
            {...dateLimits}
          />
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
