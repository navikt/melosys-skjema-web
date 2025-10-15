import { zodResolver } from "@hookform/resolvers/zod";
import { Select, TextField, VStack } from "@navikt/ds-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/DatePickerFormPart.tsx";
import { NorskeVirksomheterFormPart } from "~/components/NorskeVirksomheterFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/UtenlandskeVirksomheterFormPart.tsx";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { postArbeidstakeren } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidstakerenDto,
  ArbeidstakersSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import {
  AKTIVITET_OPTIONS,
  arbeidstakerSchema,
} from "./arbeidstakerenStegSchema.ts";
import { ArbeidstakerStegLoader } from "./components/ArbeidstakerStegLoader.tsx";

const stepKey = "arbeidstakeren";

type ArbeidstakerFormData = z.infer<typeof arbeidstakerSchema>;

interface ArbeidstakerenStegContentProps {
  skjema: ArbeidstakersSkjemaDto;
}

function ArbeidstakerenStegContent({ skjema }: ArbeidstakerenStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const {
    data: userInfo,
    isLoading: userInfoIsLoading,
    error: userinfoIsError,
  } = useQuery(getUserInfo());

  const lagretSkjemadataForSteg = skjema.data?.arbeidstakeren;

  const formMethods = useForm({
    resolver: zodResolver(arbeidstakerSchema),
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
  const harVaertEllerSkalVaereILonnetArbeidFoerUtsending = watch(
    "harVaertEllerSkalVaereILonnetArbeidFoerUtsending",
  );
  const skalJobbeForFlereVirksomheter = watch("skalJobbeForFlereVirksomheter");

  const postArbeidstakerMutation = useMutation({
    mutationFn: (data: ArbeidstakerFormData) => {
      return postArbeidstakeren(skjema.id, data as ArbeidstakerenDto);
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

  const onSubmit = (data: ArbeidstakerFormData) => {
    postArbeidstakerMutation.mutate(data);
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
              loading: postArbeidstakerMutation.isPending,
            },
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            disabled={innloggetBrukerHarNorskFodselsnummer}
            formFieldName="harNorskFodselsnummer"
            legend={t(
              "arbeidstakerenSteg.harArbeidstakerenNorskFodselsnummerEllerDNummer",
            )}
            lockedValue={innloggetBrukerHarNorskFodselsnummer}
          />

          {harNorskFodselsnummer && (
            <TextField
              className="mt-4"
              error={translateError(errors.fodselsnummer?.message)}
              label={t(
                "arbeidstakerenSteg.arbeidstakerensFodselsnummerEllerDNummer",
              )}
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
                label={t("arbeidstakerenSteg.arbeidstakerensFornavn")}
                {...register("fornavn")}
              />

              <TextField
                className="mt-4 max-w-md"
                error={translateError(errors.etternavn?.message)}
                label={t("arbeidstakerenSteg.arbeidstakerensEtternavn")}
                {...register("etternavn")}
              />

              <DatePickerFormPart
                className="mt-4"
                formFieldName="fodselsdato"
                label={t("arbeidstakerenSteg.arbeidstakerensFodselsdato")}
              />
            </>
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harVaertEllerSkalVaereILonnetArbeidFoerUtsending"
            legend={t(
              "arbeidstakerenSteg.harDuVaertEllerSkalVaereILonnetArbeidINorgeIMinst1ManedRettForUtsendingen",
            )}
          />

          {harVaertEllerSkalVaereILonnetArbeidFoerUtsending === false && (
            <Select
              className="mt-4"
              error={translateError(
                errors.aktivitetIMaanedenFoerUtsendingen?.message,
              )}
              label={t("arbeidstakerenSteg.aktivitet")}
              style={{ width: "fit-content" }}
              {...register("aktivitetIMaanedenFoerUtsendingen")}
            >
              <option value="">{t("arbeidstakerenSteg.velgAktivitet")}</option>
              {AKTIVITET_OPTIONS.map((aktivitetOption) => (
                <option
                  key={aktivitetOption.value}
                  value={aktivitetOption.value}
                >
                  {t(aktivitetOption.labelKey)}
                </option>
              ))}
            </Select>
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="skalJobbeForFlereVirksomheter"
            legend={t(
              "arbeidstakerenSteg.skalDuJobbeForFlereVirksomheterIPerioden",
            )}
          />

          {skalJobbeForFlereVirksomheter === true && (
            <VStack className="mt-4" style={{ gap: "var(--a-spacing-4)" }}>
              <NorskeVirksomheterFormPart fieldName="virksomheterArbeidstakerJobberForIutsendelsesPeriode.norskeVirksomheter" />

              <UtenlandskeVirksomheterFormPart fieldName="virksomheterArbeidstakerJobberForIutsendelsesPeriode.utenlandskeVirksomheter" />
            </VStack>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

interface ArbeidstakerenStegProps {
  id: string;
}

export function ArbeidstakerenSteg({ id }: ArbeidstakerenStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <ArbeidstakerenStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}
