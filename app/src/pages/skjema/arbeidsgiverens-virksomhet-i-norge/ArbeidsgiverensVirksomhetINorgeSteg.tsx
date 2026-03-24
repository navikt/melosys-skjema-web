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
import {
  getSkjemaQuery,
  postArbeidsgiverensVirksomhetINorge,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidsgiverensVirksomhetINorgeDto,
  Skjemadel,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getArbeidsgiverensVirksomhetINorge } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { arbeidsgiverensVirksomhetSchema } from "./arbeidsgiverensVirksomhetINorgeStegSchema.ts";

type ArbeidsgiverensVirksomhetFormData = z.infer<
  typeof arbeidsgiverensVirksomhetSchema
>;

function ArbeidsgiverensVirksomhetINorgeStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const stegData = getArbeidsgiverensVirksomhetINorge(skjema);
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
        skjema.id,
        data as ArbeidsgiverensVirksomhetINorgeDto,
      );
    },
    onSuccess: async () => {
      await invalidateArbeidsgiverSkjemaQuery(skjema.id);
      const nextStep = getNextStep(
        StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
        stegRekkefolge,
      );
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

export function ArbeidsgiverensVirksomhetINorgeSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader
      allowedSkjemadeler={[
        Skjemadel.ARBEIDSGIVERS_DEL,
        Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
      ]}
      id={id}
      skjemaQuery={getSkjemaQuery}
    >
      {(skjema) => (
        <ArbeidsgiverensVirksomhetINorgeStegContent skjema={skjema} />
      )}
    </SkjemaStegLoader>
  );
}
