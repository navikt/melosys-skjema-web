import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { registerVirksomhetInfo } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { ArbeidsgiversSkjemaDto } from "~/types/melosysSkjemaTypes.ts";

import { arbeidsgiverensVirksomhetSchema } from "./arbeidsgiverensVirksomhetINorgeStegSchema.ts";
import { ArbeidsgiverStegLoader } from "./components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "arbeidsgiverens-virksomhet-i-norge";

type ArbeidsgiverensVirksomhetFormData = z.infer<
  typeof arbeidsgiverensVirksomhetSchema
>;

interface ArbeidsgiverensVirksomhetINorgeStegContentProps {
  skjema: ArbeidsgiversSkjemaDto;
}

function ArbeidsgiverensVirksomhetINorgeStegContent({
  skjema,
}: ArbeidsgiverensVirksomhetINorgeStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const lagretSkjemadataForSteg = skjema.data?.arbeidsgiverensVirksomhetINorge;

  const formMethods = useForm<ArbeidsgiverensVirksomhetFormData>({
    resolver: zodResolver(arbeidsgiverensVirksomhetSchema),
    defaultValues: {
      ...lagretSkjemadataForSteg,
    },
  });

  const { handleSubmit, watch } = formMethods;

  const erArbeidsgiverenOffentligVirksomhet = watch(
    "erArbeidsgiverenOffentligVirksomhet",
  );

  const registerVirksomhetMutation = useMutation({
    mutationFn: (data: ArbeidsgiverensVirksomhetFormData) =>
      registerVirksomhetInfo(skjema.id, {
        erArbeidsgiverenOffentligVirksomhet:
          data.erArbeidsgiverenOffentligVirksomhet,
        erArbeidsgiverenBemanningsEllerVikarbyraa:
          data.erArbeidsgiverenBemanningsEllerVikarbyraa || false,
        opprettholderArbeidsgivereVanligDrift:
          data.opprettholderArbeidsgivereVanligDrift || false,
      }),
    onSuccess: () => {
      const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
      if (nextStep) {
        const nextRoute = nextStep.route.replace("$id", skjema.id);
        navigate({ to: nextRoute });
      }
    },
    onError: () => {
      toast.error("Kunne ikke lagre virksomhetsinformasjon. Prøv igjen.");
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
                formFieldName="opprettholderArbeidsgivereVanligDrift"
                legend={t(
                  "arbeidsgiverensVirksomhetINorgeSteg.opprettholderArbeidsgivereVanligDriftINorge",
                )}
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

interface ArbeidsgiverensVirksomhetINorgeStegProps {
  id: string;
}

export function ArbeidsgiverensVirksomhetINorgeSteg({
  id,
}: ArbeidsgiverensVirksomhetINorgeStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => (
        <ArbeidsgiverensVirksomhetINorgeStegContent skjema={skjema} />
      )}
    </ArbeidsgiverStegLoader>
  );
}
