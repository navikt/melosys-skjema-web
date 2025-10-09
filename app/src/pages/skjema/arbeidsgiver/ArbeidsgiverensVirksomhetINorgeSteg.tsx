import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import {
  getSkjemaAsArbeidsgiverQuery,
  registerVirksomhetInfo,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { ArbeidsgiversSkjemaDto } from "~/types/melosysSkjemaTypes.ts";

import { arbeidsgiverensVirksomhetSchema } from "./arbeidsgiverensVirksomhetINorgeStegSchema.ts";
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

export function ArbeidsgiverensVirksomhetINorgeSteg() {
  const { id } = useParams({
    from: "/skjema/arbeidsgiver/$id/arbeidsgiverens-virksomhet-i-norge",
  });

  const {
    data: skjema,
    isLoading,
    error,
  } = useQuery(getSkjemaAsArbeidsgiverQuery(id));

  if (isLoading) {
    return <div>Laster skjema...</div>;
  }

  if (error) {
    return <div>Feil ved lasting av skjema</div>;
  }

  if (!skjema) {
    return <div>Fant ikke skjema</div>;
  }

  return <ArbeidsgiverensVirksomhetINorgeStegContent skjema={skjema} />;
}
