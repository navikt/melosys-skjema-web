import { zodResolver } from "@hookform/resolvers/zod";
import { Detail, ErrorMessage, Label, VStack } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { NorskeVirksomheterFormPart } from "~/components/NorskeVirksomheterFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/UtenlandskeVirksomheterFormPart.tsx";
import { postArbeidstakerensLonn } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidsgiversSkjemaDto,
  ArbeidstakerensLonnDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidstakerensLonnSchema } from "./arbeidstakerensLonnStegSchema.ts";
import { ArbeidsgiverStegLoader } from "./components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

export const stepKey = "arbeidstakerens-lonn";

type ArbeidstakerensLonnFormData = z.infer<typeof arbeidstakerensLonnSchema>;

interface ArbeidstakerensLonnStegContentProps {
  skjema: ArbeidsgiversSkjemaDto;
}

function ArbeidstakerensLonnStegContent({
  skjema,
}: ArbeidstakerensLonnStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const lagretSkjemadataForSteg = skjema.data?.arbeidstakerensLonn;

  const formMethods = useForm({
    resolver: zodResolver(arbeidstakerensLonnSchema),
    defaultValues: {
      ...lagretSkjemadataForSteg,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = formMethods;

  const arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden = watch(
    "arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden",
  );

  const registerArbeidstakerLonnMutation = useMutation({
    mutationFn: (data: ArbeidstakerensLonnFormData) => {
      return postArbeidstakerensLonn(skjema.id, data as ArbeidstakerensLonnDto);
    },
    onSuccess: () => {
      const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
      if (nextStep) {
        const nextRoute = nextStep.route.replace("$id", skjema.id);
        navigate({ to: nextRoute });
      }
    },
    onError: () => {
      toast.error("Kunne ikke lagre lønn-informasjon. Prøv igjen.");
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
            stepKey,
            stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
            },
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden"
            legend={t(
              "arbeidstakerenslonnSteg.utbetalerDuSomArbeidsgiverAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden",
            )}
          />

          {arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden ===
            false && (
            <VStack className="mt-4" gap="space-8">
              <Label>
                {t(
                  "arbeidstakerenslonnSteg.hvemUtbetalerLonnenOgEventuelleNaturalytelser",
                )}
              </Label>
              <Detail>
                {t(
                  "arbeidstakerenslonnSteg.leggTilNorskeOgEllerUtenlandskeVirksomheterSomUtbetalerLonnenOgEventuelleNaturalytelser",
                )}
              </Detail>

              <NorskeVirksomheterFormPart
                clearErrorsFieldName="virksomheterSomUtbetalerLonnOgNaturalytelser"
                fieldName="virksomheterSomUtbetalerLonnOgNaturalytelser.norskeVirksomheter"
              />

              <UtenlandskeVirksomheterFormPart
                clearErrorsFieldName="virksomheterSomUtbetalerLonnOgNaturalytelser"
                fieldName="virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter"
              />

              {errors.virksomheterSomUtbetalerLonnOgNaturalytelser && (
                <ErrorMessage className="mt-2">
                  {translateError(
                    errors.virksomheterSomUtbetalerLonnOgNaturalytelser.message,
                  )}
                </ErrorMessage>
              )}
            </VStack>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

interface ArbeidstakerensLonnStegProps {
  id: string;
}

export function ArbeidstakerensLonnSteg({ id }: ArbeidstakerensLonnStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <ArbeidstakerensLonnStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}
