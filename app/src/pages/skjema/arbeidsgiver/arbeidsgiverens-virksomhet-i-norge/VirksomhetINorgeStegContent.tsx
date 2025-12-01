import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useInvalidateArbeidsgiversSkjemaQuery } from "~/hooks/useInvalidateArbeidsgiversSkjemaQuery.ts";
import { postArbeidsgiverensVirksomhetINorge } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { ArbeidsgiverensVirksomhetINorgeDto } from "~/types/melosysSkjemaTypes.ts";

import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";
import { arbeidsgiverensVirksomhetSchema } from "./arbeidsgiverensVirksomhetINorgeStegSchema.ts";

export const stepKey = "arbeidsgiverens-virksomhet-i-norge";

type ArbeidsgiverensVirksomhetFormData = z.infer<
  typeof arbeidsgiverensVirksomhetSchema
>;

export function VirksomhetINorgeStegContent({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidsgiverSkjemaQuery =
    useInvalidateArbeidsgiversSkjemaQuery();

  const lagretSkjemadataForSteg = skjema.data?.arbeidsgiverensVirksomhetINorge;

  const formMethods = useForm({
    // @ts-expect-error - discriminated union literals vs DTO boolean types
    resolver: zodResolver(arbeidsgiverensVirksomhetSchema),
    ...(lagretSkjemadataForSteg && { defaultValues: lagretSkjemadataForSteg }),
  });

  const { handleSubmit, control } = formMethods;

  const erArbeidsgiverenOffentligVirksomhet = useWatch({
    control,
    name: "erArbeidsgiverenOffentligVirksomhet",
  });

  const registerVirksomhetMutation = useMutation({
    mutationFn: (data: ArbeidsgiverensVirksomhetFormData) => {
      return postArbeidsgiverensVirksomhetINorge(
        skjema.id,
        data as ArbeidsgiverensVirksomhetINorgeDto,
      );
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

  const onSubmit = (data: ArbeidsgiverensVirksomhetFormData) => {
    registerVirksomhetMutation.mutate(data);
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
              loading: registerVirksomhetMutation.isPending,
            },
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            description={t(
              "arbeidsgiverensVirksomhetINorgeSteg.offentligeVirksomheterErStatsorganerOgUnderliggendeVirksomheter",
            )}
            formFieldName="erArbeidsgiverenOffentligVirksomhet"
            legend={t(
              "arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEnOffentligVirksomhet",
            )}
          />

          {erArbeidsgiverenOffentligVirksomhet === false && (
            <>
              <RadioGroupJaNeiFormPart
                className="mt-4"
                formFieldName="erArbeidsgiverenBemanningsEllerVikarbyraa"
                legend={t(
                  "arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEtBemanningsEllerVikarbyra",
                )}
              />

              <RadioGroupJaNeiFormPart
                className="mt-4"
                description={t(
                  "arbeidsgiverensVirksomhetINorgeSteg.medDetteMenerViAtArbeidsgivereFortsattHarAktivitetOgAnsatteSomJobberINorgeIPerioden",
                )}
                formFieldName="opprettholderArbeidsgiverenVanligDrift"
                legend={t(
                  "arbeidsgiverensVirksomhetINorgeSteg.opprettholderArbeidsgiverenVanligDriftINorge",
                )}
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
