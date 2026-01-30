import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { PeriodeFormPart } from "~/components/date/PeriodeFormPart.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useInvalidateArbeidsgiversSkjemaQuery } from "~/hooks/useInvalidateArbeidsgiversSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon";
import { postUtenlandsoppdraget } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { getFieldError } from "~/utils/formErrors.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";
import { utenlandsoppdragSchema } from "./utenlandsoppdragetStegSchema.ts";

export const stepKey = "utenlandsoppdraget";

// Date range constants for assignment period selection
const YEARS_FORWARD_FROM_CURRENT = 100;

type UtenlandsoppdragFormData = z.infer<typeof utenlandsoppdragSchema>;

function UtenlandsoppdragetStegContent({ skjema }: ArbeidsgiverSkjemaProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidsgiverSkjemaQuery =
    useInvalidateArbeidsgiversSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

  const utsendelseLandFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "utsendelseLand",
  );
  const utsendelsePeriodeFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "arbeidstakerUtsendelsePeriode",
  );
  const harOppdragILandetFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "arbeidsgiverHarOppdragILandet",
  );
  const bleAnsattForOppdragFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "arbeidstakerBleAnsattForUtenlandsoppdraget",
  );
  const forblirAnsattFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "arbeidstakerForblirAnsattIHelePerioden",
  );
  const erstatterAnnenFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "arbeidstakerErstatterAnnenPerson",
  );
  const vilJobbeEtterOppdragFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget",
  );
  const begrunnelseFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "utenlandsoppholdetsBegrunnelse",
  );
  const ansettelsesforholdFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "ansettelsesforholdBeskrivelse",
  );
  const forrigePeriodeFelt = getFelt(
    "utenlandsoppdragetArbeidsgiver",
    "forrigeArbeidstakerUtsendelsePeriode",
  );

  const lagretSkjemadataForSteg = skjema.data?.utenlandsoppdraget;

  const formMethods = useForm({
    resolver: zodResolver(utenlandsoppdragSchema),
    ...(lagretSkjemadataForSteg && { defaultValues: lagretSkjemadataForSteg }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = formMethods;

  const dateLimits = {
    // Dato norge ble EØS medlem
    fromDate: new Date(1995, 0, 1),
    toDate: new Date(
      new Date().getFullYear() + YEARS_FORWARD_FROM_CURRENT,
      11,
      31,
    ),
  };

  const arbeidstakerErstatterAnnenPerson = useWatch({
    control,
    name: "arbeidstakerErstatterAnnenPerson",
  });
  const arbeidsgiverHarOppdragILandet = useWatch({
    control,
    name: "arbeidsgiverHarOppdragILandet",
  });
  const arbeidstakerForblirAnsattIHelePerioden = useWatch({
    control,
    name: "arbeidstakerForblirAnsattIHelePerioden",
  });
  const arbeidstakerBleAnsattForUtenlandsoppdraget = useWatch({
    control,
    name: "arbeidstakerBleAnsattForUtenlandsoppdraget",
  });

  const registerUtenlandsoppdragMutation = useMutation({
    mutationFn: (data: UtenlandsoppdragFormData) => {
      return postUtenlandsoppdraget(skjema.id, data);
    },
    onSuccess: async () => {
      await invalidateArbeidsgiverSkjemaQuery(skjema.id);
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
          }}
          nesteKnapp={
            <NesteStegKnapp
              loading={registerUtenlandsoppdragMutation.isPending}
            />
          }
        >
          <LandVelgerFormPart
            className="mt-4"
            formFieldName="utsendelseLand"
            label={utsendelseLandFelt.label}
          />

          <PeriodeFormPart
            className="mt-6"
            defaultFraDato={
              lagretSkjemadataForSteg?.arbeidstakerUtsendelsePeriode?.fraDato
                ? new Date(
                    lagretSkjemadataForSteg.arbeidstakerUtsendelsePeriode
                      .fraDato,
                  )
                : undefined
            }
            defaultTilDato={
              lagretSkjemadataForSteg?.arbeidstakerUtsendelsePeriode?.tilDato
                ? new Date(
                    lagretSkjemadataForSteg.arbeidstakerUtsendelsePeriode
                      .tilDato,
                  )
                : undefined
            }
            formFieldName="arbeidstakerUtsendelsePeriode"
            label={utsendelsePeriodeFelt.label}
            tilDatoDescription={utsendelsePeriodeFelt.hjelpetekst}
            {...dateLimits}
          />

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidsgiverHarOppdragILandet"
            legend={harOppdragILandetFelt.label}
          />

          {arbeidsgiverHarOppdragILandet === false && (
            <Textarea
              className="mt-6"
              error={translateError(
                getFieldError(errors, "utenlandsoppholdetsBegrunnelse"),
              )}
              label={begrunnelseFelt.label}
              {...register("utenlandsoppholdetsBegrunnelse")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerBleAnsattForUtenlandsoppdraget"
            legend={bleAnsattForOppdragFelt.label}
          />

          {arbeidstakerBleAnsattForUtenlandsoppdraget && (
            <RadioGroupJaNeiFormPart
              className="mt-6"
              formFieldName="arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"
              legend={vilJobbeEtterOppdragFelt.label}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerForblirAnsattIHelePerioden"
            legend={forblirAnsattFelt.label}
          />

          {arbeidstakerForblirAnsattIHelePerioden === false && (
            <Textarea
              className="mt-6"
              error={translateError(
                getFieldError(errors, "ansettelsesforholdBeskrivelse"),
              )}
              label={ansettelsesforholdFelt.label}
              {...register("ansettelsesforholdBeskrivelse")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerErstatterAnnenPerson"
            legend={erstatterAnnenFelt.label}
          />

          {arbeidstakerErstatterAnnenPerson && (
            <PeriodeFormPart
              className="mt-6"
              defaultFraDato={
                lagretSkjemadataForSteg?.forrigeArbeidstakerUtsendelsePeriode
                  ?.fraDato
                  ? new Date(
                      lagretSkjemadataForSteg
                        .forrigeArbeidstakerUtsendelsePeriode.fraDato,
                    )
                  : undefined
              }
              defaultTilDato={
                lagretSkjemadataForSteg?.forrigeArbeidstakerUtsendelsePeriode
                  ?.tilDato
                  ? new Date(
                      lagretSkjemadataForSteg
                        .forrigeArbeidstakerUtsendelsePeriode.tilDato,
                    )
                  : undefined
              }
              formFieldName="forrigeArbeidstakerUtsendelsePeriode"
              label={forrigePeriodeFelt.label}
              {...dateLimits}
            />
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
