import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@navikt/ds-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/DatePickerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useInvalidateArbeidstakersSkjemaQuery } from "~/hooks/useInvalidateArbeidstakersSkjemaQuery.ts";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { postDineOpplysninger } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { ArbeidstakersSkjemaDto } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { dineOpplysningerSchema } from "./dineOpplysningerStegSchema.ts";

export const stepKey = "dine-opplysninger";

type DineOpplysningerFormData = z.infer<typeof dineOpplysningerSchema>;

interface DineOpplysningerStegContentProps {
  skjema: ArbeidstakersSkjemaDto;
}

function DineOpplysningerStegContent({
  skjema,
}: DineOpplysningerStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidstakerSkjemaQuery =
    useInvalidateArbeidstakersSkjemaQuery();

  const {
    data: userInfo,
    isLoading: userInfoIsLoading,
    error: userinfoIsError,
  } = useQuery(getUserInfo());

  const lagretSkjemadataForSteg = skjema.data?.arbeidstakeren;

  const formMethods = useForm({
    resolver: zodResolver(dineOpplysningerSchema),
    defaultValues: {
      ...lagretSkjemadataForSteg,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = formMethods;

  const innloggetBrukerHarNorskFodselsnummer = userInfo?.userId !== undefined;

  useEffect(() => {
    if (innloggetBrukerHarNorskFodselsnummer) {
      setValue("fodselsnummer", userInfo.userId);
    }
  }, [innloggetBrukerHarNorskFodselsnummer, userInfo?.userId, setValue]);

  const harNorskFodselsnummer =
    watch("harNorskFodselsnummer") || innloggetBrukerHarNorskFodselsnummer;

  const postDineOpplysningerMutation = useMutation({
    mutationFn: (data: DineOpplysningerFormData) => {
      return postDineOpplysninger(skjema.id, data);
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

  const onSubmit = (data: DineOpplysningerFormData) => {
    postDineOpplysningerMutation.mutate(data);
  };

  if (userInfoIsLoading) {
    return <div>Loading...</div>;
  }

  if (userinfoIsError) {
    return <div>Error loading user info</div>;
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
              loading: postDineOpplysningerMutation.isPending,
            },
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            disabled={innloggetBrukerHarNorskFodselsnummer}
            formFieldName="harNorskFodselsnummer"
            legend={t(
              "dineOpplysningerSteg.harDuNorskFodselsnummerEllerDNummer",
            )}
            lockedValue={innloggetBrukerHarNorskFodselsnummer}
          />

          {harNorskFodselsnummer && (
            <TextField
              className="mt-4"
              error={translateError(errors.fodselsnummer?.message)}
              label={t("dineOpplysningerSteg.dittFodselsnummerEllerDNummer")}
              size="medium"
              style={{ maxWidth: "160px" }}
              {...register("fodselsnummer")}
              disabled={innloggetBrukerHarNorskFodselsnummer}
            />
          )}

          {harNorskFodselsnummer === false && (
            <>
              <TextField
                className="mt-4 max-w-md"
                error={translateError(errors.fornavn?.message)}
                label={t("dineOpplysningerSteg.dittFornavn")}
                {...register("fornavn")}
              />

              <TextField
                className="mt-4 max-w-md"
                error={translateError(errors.etternavn?.message)}
                label={t("dineOpplysningerSteg.dittEtternavn")}
                {...register("etternavn")}
              />

              <DatePickerFormPart
                className="mt-4"
                formFieldName="fodselsdato"
                label={t("dineOpplysningerSteg.dinFodselsdato")}
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

interface DineOpplysningerStegProps {
  id: string;
}

export function DineOpplysningerSteg({ id }: DineOpplysningerStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <DineOpplysningerStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}
