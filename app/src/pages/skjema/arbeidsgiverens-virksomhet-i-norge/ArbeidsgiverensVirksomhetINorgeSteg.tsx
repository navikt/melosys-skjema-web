import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, Resolver, useForm, useWatch } from "react-hook-form";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import {
  getSkjemaVersjonsprofil,
  OffentligArbeidsgiverKilde,
} from "~/constants/skjemaVersjoner.ts";
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
import { getStegRekkefolge } from "../stegRekkefølge.ts";
import {
  arbeidsgiverensVirksomhetSchema,
  arbeidsgiverensVirksomhetSchemaV2,
} from "./arbeidsgiverensVirksomhetINorgeStegSchema.ts";

function ArbeidsgiverensVirksomhetINorgeStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = getStegRekkefolge(skjema);
  const brukerRegisterklassifisering =
    getSkjemaVersjonsprofil(skjema.skjemaDefinisjonVersjon)
      .offentligArbeidsgiverKilde ===
    OffentligArbeidsgiverKilde.ENHETSREGISTERET;
  const stegData = getArbeidsgiverensVirksomhetINorge(skjema);
  const navigate = useNavigate();
  const invalidateArbeidsgiverSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon(skjema.skjemaDefinisjonVersjon);

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

  const formMethods = useForm<ArbeidsgiverensVirksomhetINorgeDto>({
    resolver: zodResolver(
      brukerRegisterklassifisering
        ? arbeidsgiverensVirksomhetSchemaV2
        : arbeidsgiverensVirksomhetSchema,
    ) as Resolver<ArbeidsgiverensVirksomhetINorgeDto>,
    ...(stegData && { defaultValues: stegData }),
  });

  const { handleSubmit, control } = formMethods;

  const erArbeidsgiverenOffentligVirksomhet = useWatch({
    control,
    name: "erArbeidsgiverenOffentligVirksomhet",
  });

  const registerVirksomhetMutation = useMutation({
    mutationFn: (data: ArbeidsgiverensVirksomhetINorgeDto) => {
      return postArbeidsgiverensVirksomhetINorge(
        skjema.id,
        skjema.skjemaDefinisjonVersjon,
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
  });

  const onSubmit = (data: ArbeidsgiverensVirksomhetINorgeDto) => {
    registerVirksomhetMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey: StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
            skjema,
          }}
          isSubmitError={registerVirksomhetMutation.isError}
          nesteKnapp={
            <NesteStegKnapp loading={registerVirksomhetMutation.isPending} />
          }
        >
          {!brukerRegisterklassifisering && (
            <RadioGroupJaNeiFormPart
              className="mt-4"
              description={erOffentligFelt.hjelpetekst}
              formFieldName="erArbeidsgiverenOffentligVirksomhet"
              legend={erOffentligFelt.label}
            />
          )}

          {(brukerRegisterklassifisering ||
            erArbeidsgiverenOffentligVirksomhet === false) && (
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
      stepKey={StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE}
    >
      {(skjema) => (
        <ArbeidsgiverensVirksomhetINorgeStegContent skjema={skjema} />
      )}
    </SkjemaStegLoader>
  );
}
