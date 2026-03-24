import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { NorskeOgUtenlandskeVirksomheterFormPart } from "~/components/virksomheter/NorskeOgUtenlandskeVirksomheterFormPart.tsx";
import { StegKey } from "~/constants/stegKeys.ts";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postArbeidstakerensLonn,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type { ArbeidstakerensLonnDto } from "~/types/melosysSkjemaTypes.ts";
import {
  Skjemadel,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getArbeidstakerensLonn } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { arbeidstakerensLonnSchema } from "./arbeidstakerensLonnStegSchema.ts";

type ArbeidstakerensLonnFormData = z.infer<typeof arbeidstakerensLonnSchema>;

function ArbeidstakerensLonnStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const stegData = getArbeidstakerensLonn(skjema);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidsgiverSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

  const betalerAllLonnFelt = getFelt(
    "arbeidstakerensLonn",
    "arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden",
  );
  const virksomheterFelt = getFelt(
    "arbeidstakerensLonn",
    "virksomheterSomUtbetalerLonnOgNaturalytelser",
  );

  const formMethods = useForm({
    resolver: zodResolver(arbeidstakerensLonnSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const { handleSubmit, setError, clearErrors, control } = formMethods;

  const arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden = useWatch(
    {
      control,
      name: "arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden",
    },
  );

  const registerArbeidstakerLonnMutation = useMutation({
    mutationFn: (data: ArbeidstakerensLonnFormData) => {
      return postArbeidstakerensLonn(skjema.id, data as ArbeidstakerensLonnDto);
    },
    onSuccess: async () => {
      await invalidateArbeidsgiverSkjemaQuery(skjema.id);
      const nextStep = getNextStep(
        StegKey.ARBEIDSTAKERENS_LONN,
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

  const onSubmit = (data: ArbeidstakerensLonnFormData) => {
    // Custom validation - require at least one company (Norwegian or foreign)
    if (!data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden) {
      const antallNorskeVirksomheter =
        data.virksomheterSomUtbetalerLonnOgNaturalytelser?.norskeVirksomheter
          ?.length || 0;
      const antallUtenlandskeVirksomheter =
        data.virksomheterSomUtbetalerLonnOgNaturalytelser
          ?.utenlandskeVirksomheter?.length || 0;

      if (antallNorskeVirksomheter + antallUtenlandskeVirksomheter === 0) {
        setError("virksomheterSomUtbetalerLonnOgNaturalytelser", {
          type: "required",
          message: t(
            "arbeidstakerenslonnSteg.duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv",
          ),
        });
        return;
      }
    }

    // Clear any previous errors
    clearErrors("virksomheterSomUtbetalerLonnOgNaturalytelser");

    registerArbeidstakerLonnMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey: StegKey.ARBEIDSTAKERENS_LONN,
            stegRekkefolge: stegRekkefolge,
          }}
          nesteKnapp={
            <NesteStegKnapp
              loading={registerArbeidstakerLonnMutation.isPending}
            />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden"
            legend={betalerAllLonnFelt.label}
          />

          {arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden ===
            false && (
            <NorskeOgUtenlandskeVirksomheterFormPart
              description={virksomheterFelt.hjelpetekst}
              fieldName="virksomheterSomUtbetalerLonnOgNaturalytelser"
              label={virksomheterFelt.label}
            />
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function ArbeidstakerensLonnSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader
      allowedSkjemadeler={[
        Skjemadel.ARBEIDSGIVERS_DEL,
        Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
      ]}
      id={id}
      skjemaQuery={getSkjemaQuery}
    >
      {(skjema) => <ArbeidstakerensLonnStegContent skjema={skjema} />}
    </SkjemaStegLoader>
  );
}
