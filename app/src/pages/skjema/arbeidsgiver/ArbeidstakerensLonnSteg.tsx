import { zodResolver } from "@hookform/resolvers/zod";
import { Detail, ErrorMessage, Label, VStack } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { NorskeVirksomheterFormPart } from "~/components/NorskeVirksomheterFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/UtenlandskeVirksomheterFormPart.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { getNextStep } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidstakerensLonnSchema } from "./arbeidstakerensLonnStegSchema.ts";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "arbeidstakerens-lonn";

type ArbeidstakerensLonnFormData = z.infer<typeof arbeidstakerensLonnSchema>;

export function ArbeidstakerensLonnSteg() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const formMethods = useForm<ArbeidstakerensLonnFormData>({
    resolver: zodResolver(arbeidstakerensLonnSchema),
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

    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
    if (nextStep) {
      navigate({ to: nextStep.route });
    }
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
