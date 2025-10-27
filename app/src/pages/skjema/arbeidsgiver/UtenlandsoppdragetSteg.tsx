import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/DatePickerFormPart.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useInvalidateArbeidsgiversSkjemaQuery } from "~/hooks/useInvalidateArbeidsgiversSkjemaQuery.ts";
import { postUtenlandsoppdraget } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { UtenlandsoppdragetDto } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidsgiverStegLoader } from "./components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "./types.ts";
import { utenlandsoppdragSchema } from "./utenlandsoppdragetStegSchema.ts";

export const stepKey = "utenlandsoppdraget";

// Date range constants for assignment period selection
const YEARS_BACK_FROM_CURRENT = 1;
const YEARS_FORWARD_FROM_CURRENT = 5;

type UtenlandsoppdragFormData = z.infer<typeof utenlandsoppdragSchema>;

function UtenlandsoppdragetStegContent({ skjema }: ArbeidsgiverSkjemaProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidsgiverSkjemaQuery =
    useInvalidateArbeidsgiversSkjemaQuery();

  const lagretSkjemadataForSteg = skjema.data?.utenlandsoppdraget;

  const formMethods = useForm({
    resolver: zodResolver(utenlandsoppdragSchema),
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

  const arbeidstakerErstatterAnnenPerson = watch(
    "arbeidstakerErstatterAnnenPerson",
  );
  const arbeidsgiverHarOppdragILandet = watch("arbeidsgiverHarOppdragILandet");
  const arbeidstakerForblirAnsattIHelePerioden = watch(
    "arbeidstakerForblirAnsattIHelePerioden",
  );
  const arbeidstakerBleAnsattForUtenlandsoppdraget = watch(
    "arbeidstakerBleAnsattForUtenlandsoppdraget",
  );

  const registerUtenlandsoppdragMutation = useMutation({
    mutationFn: (data: UtenlandsoppdragFormData) => {
      const apiPayload = data as UtenlandsoppdragetDto;
      return postUtenlandsoppdraget(skjema.id, apiPayload);
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

  const onSubmit = (data: UtenlandsoppdragFormData) => {
    registerUtenlandsoppdragMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
              loading: registerUtenlandsoppdragMutation.isPending,
            },
          }}
        >
          <LandVelgerFormPart
            className="mt-4"
            formFieldName="utsendelseLand"
            label={t(
              "utenlandsoppdragetSteg.hvilketLandSendesArbeidstakerenTil",
            )}
          />

          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold">
              {t("utenlandsoppdragetSteg.utsendingsperiode")}
            </h3>

            <DatePickerFormPart
              className="mt-4"
              defaultSelected={
                lagretSkjemadataForSteg?.arbeidstakerUtsendelseFraDato
                  ? new Date(
                      lagretSkjemadataForSteg.arbeidstakerUtsendelseFraDato,
                    )
                  : undefined
              }
              formFieldName="arbeidstakerUtsendelseFraDato"
              label={t("utenlandsoppdragetSteg.fraDato")}
              {...dateLimits}
            />

            <DatePickerFormPart
              className="mt-4"
              defaultSelected={
                lagretSkjemadataForSteg?.arbeidstakerUtsendelseTilDato
                  ? new Date(
                      lagretSkjemadataForSteg.arbeidstakerUtsendelseTilDato,
                    )
                  : undefined
              }
              description={t(
                "utenlandsoppdragetSteg.oppgiOmtrentligDatoHvisDuIkkeVetNoyaktigDato",
              )}
              formFieldName="arbeidstakerUtsendelseTilDato"
              label={t("utenlandsoppdragetSteg.tilDato")}
              {...dateLimits}
            />
          </div>

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidsgiverHarOppdragILandet"
            legend={t(
              "utenlandsoppdragetSteg.harDuSomArbeidsgiverOppdragILandetArbeidstakerSkalSendesUtTil",
            )}
          />

          {arbeidsgiverHarOppdragILandet === false && (
            <Textarea
              className="mt-6"
              error={translateError(
                errors.utenlandsoppholdetsBegrunnelse?.message,
              )}
              label={t(
                "utenlandsoppdragetSteg.hvorforSkalArbeidstakerenArbeideIUtlandet",
              )}
              {...register("utenlandsoppholdetsBegrunnelse")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerBleAnsattForUtenlandsoppdraget"
            legend={t(
              "utenlandsoppdragetSteg.bleArbeidstakerAnsattPaGrunnAvDetteUtenlandsoppdraget",
            )}
          />

          {arbeidstakerBleAnsattForUtenlandsoppdraget && (
            <RadioGroupJaNeiFormPart
              className="mt-6"
              formFieldName="arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"
              legend={t(
                "utenlandsoppdragetSteg.vilArbeidstakerenArbeideForVirksomhetenINorgeEtterUtenlandsoppdraget",
              )}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerForblirAnsattIHelePerioden"
            legend={t(
              "utenlandsoppdragetSteg.vilArbeidstakerFortsattVareAnsattHostDereIHeleUtsendingsperioden",
            )}
          />

          {arbeidstakerForblirAnsattIHelePerioden === false && (
            <Textarea
              className="mt-6"
              error={translateError(
                errors.ansettelsesforholdBeskrivelse?.message,
              )}
              label={t(
                "utenlandsoppdragetSteg.beskrivArbeidstakerensAnsettelsesforholdIUtsendingsperioden",
              )}
              {...register("ansettelsesforholdBeskrivelse")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerErstatterAnnenPerson"
            legend={t(
              "utenlandsoppdragetSteg.erstatterArbeidstakerEnAnnenPersonSomVarSendtUtForAGjoreDetSammeArbeidet",
            )}
          />

          {arbeidstakerErstatterAnnenPerson && (
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold">
                {t("utenlandsoppdragetSteg.forrigeArbeidstakersUtsendelse")}
              </h3>

              <DatePickerFormPart
                className="mt-4"
                defaultSelected={
                  lagretSkjemadataForSteg?.forrigeArbeidstakerUtsendelseFradato
                    ? new Date(
                        lagretSkjemadataForSteg.forrigeArbeidstakerUtsendelseFradato,
                      )
                    : undefined
                }
                formFieldName="forrigeArbeidstakerUtsendelseFradato"
                label={t("utenlandsoppdragetSteg.fraDato")}
                {...dateLimits}
              />

              <DatePickerFormPart
                className="mt-4"
                defaultSelected={
                  lagretSkjemadataForSteg?.forrigeArbeidstakerUtsendelseTilDato
                    ? new Date(
                        lagretSkjemadataForSteg.forrigeArbeidstakerUtsendelseTilDato,
                      )
                    : undefined
                }
                formFieldName="forrigeArbeidstakerUtsendelseTilDato"
                label={t("utenlandsoppdragetSteg.tilDato")}
                {...dateLimits}
              />
            </div>
          )}
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
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <UtenlandsoppdragetStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}
