import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { PeriodeFormPart } from "~/components/date/PeriodeFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { StegKey } from "~/constants/stegKeys.ts";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postUtenlandsoppdraget,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type {
  UtenlandsoppdragetDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import { Skjemadel } from "~/types/melosysSkjemaTypes.ts";
import { getFieldError } from "~/utils/formErrors.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getUtenlandsoppdraget } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { utenlandsoppdragSchema } from "./utenlandsoppdragetStegSchema.ts";

// Date range constants for assignment period selection
const YEARS_FORWARD_FROM_CURRENT = 100;

const DATE_LIMITS = {
  // Dato Norge ble EØS-medlem
  fromDate: new Date(1995, 0, 1),
  toDate: new Date(
    new Date().getFullYear() + YEARS_FORWARD_FROM_CURRENT,
    11,
    31,
  ),
};

function UtenlandsoppdragetStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const stegData = getUtenlandsoppdraget(skjema);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidsgiverSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

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

  const formMethods = useForm({
    resolver: zodResolver(utenlandsoppdragSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = formMethods;

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
    mutationFn: (data: UtenlandsoppdragetDto) => {
      return postUtenlandsoppdraget(skjema.id, data);
    },
    onSuccess: async () => {
      await invalidateArbeidsgiverSkjemaQuery(skjema.id);
      const nextStep = getNextStep(StegKey.UTENLANDSOPPDRAGET, stegRekkefolge);
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

  const onSubmit = (data: UtenlandsoppdragetDto) => {
    registerUtenlandsoppdragMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey: StegKey.UTENLANDSOPPDRAGET,
            skjema,
          }}
          nesteKnapp={
            <NesteStegKnapp
              loading={registerUtenlandsoppdragMutation.isPending}
            />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
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
                stegData?.forrigeArbeidstakerUtsendelsePeriode?.fraDato
                  ? new Date(
                      stegData.forrigeArbeidstakerUtsendelsePeriode.fraDato,
                    )
                  : undefined
              }
              defaultTilDato={
                stegData?.forrigeArbeidstakerUtsendelsePeriode?.tilDato
                  ? new Date(
                      stegData.forrigeArbeidstakerUtsendelsePeriode.tilDato,
                    )
                  : undefined
              }
              formFieldName="forrigeArbeidstakerUtsendelsePeriode"
              label={forrigePeriodeFelt.label}
              {...DATE_LIMITS}
            />
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function UtenlandsoppdragetSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader
      allowedSkjemadeler={[
        Skjemadel.ARBEIDSGIVERS_DEL,
        Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
      ]}
      id={id}
      skjemaQuery={getSkjemaQuery}
    >
      {(skjema) => <UtenlandsoppdragetStegContent skjema={skjema} />}
    </SkjemaStegLoader>
  );
}
