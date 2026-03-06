import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { StegKey } from "~/constants/stegKeys.ts";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import { postArbeidsgiverensVirksomhetINorge } from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { ArbeidsgiverensVirksomhetINorgeDto } from "~/types/melosysSkjemaTypes.ts";

import { arbeidsgiverensVirksomhetSchema } from "./arbeidsgiverensVirksomhetINorgeStegSchema.ts";

type ArbeidsgiverensVirksomhetFormData = z.infer<
  typeof arbeidsgiverensVirksomhetSchema
>;

export function VirksomhetINorgeStegContent({
  skjemaId,
  stegData,
  stegRekkefolge,
}: {
  skjemaId: string;
  stegData?: ArbeidsgiverensVirksomhetINorgeDto;
  stegRekkefolge: StegRekkefolgeItem[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidsgiverSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

  const erOffentligFelt = getFelt(
    "arbeidsgiverensVirksomhetINorge",
    "erArbeidsgiverenOffentligVirksomhet",
  );
  const erBemanningFelt = getFelt(
    "arbeidsgiverensVirksomhetINorge",
    "erArbeidsgiverenBemanningsEllerVikarbyraa",
  );
  const opprettholderDriftFelt = getFelt(
    "arbeidsgiverensVirksomhetINorge",
    "opprettholderArbeidsgiverenVanligDrift",
  );

  const formMethods = useForm({
    resolver: zodResolver(arbeidsgiverensVirksomhetSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const { handleSubmit, control } = formMethods;

  const erArbeidsgiverenOffentligVirksomhet = useWatch({
    control,
    name: "erArbeidsgiverenOffentligVirksomhet",
  });

  const registerVirksomhetMutation = useMutation({
    mutationFn: (data: ArbeidsgiverensVirksomhetFormData) => {
      return postArbeidsgiverensVirksomhetINorge(
        skjemaId,
        data as ArbeidsgiverensVirksomhetINorgeDto,
      );
    },
    onSuccess: async () => {
      await invalidateArbeidsgiverSkjemaQuery(skjemaId);
      const nextStep = getNextStep(
        StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
        stegRekkefolge,
      );
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

  const onSubmit = (data: ArbeidsgiverensVirksomhetFormData) => {
    registerVirksomhetMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey: StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
            stegRekkefolge: stegRekkefolge,
          }}
          nesteKnapp={
            <NesteStegKnapp loading={registerVirksomhetMutation.isPending} />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            description={erOffentligFelt.hjelpetekst}
            formFieldName="erArbeidsgiverenOffentligVirksomhet"
            legend={erOffentligFelt.label}
          />

          {erArbeidsgiverenOffentligVirksomhet === false && (
            <>
              <RadioGroupJaNeiFormPart
                className="mt-4"
                formFieldName="erArbeidsgiverenBemanningsEllerVikarbyraa"
                legend={erBemanningFelt.label}
              />

              <RadioGroupJaNeiFormPart
                className="mt-4"
                description={opprettholderDriftFelt.hjelpetekst}
                formFieldName="opprettholderArbeidsgiverenVanligDrift"
                legend={opprettholderDriftFelt.label}
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
