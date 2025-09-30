import { zodResolver } from "@hookform/resolvers/zod";
import { Detail, ErrorMessage, Label, VStack } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { NorskeVirksomheterFormPart } from "~/components/NorskeVirksomheterFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/UtenlandskeVirksomheterFormPart.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { getNextStep } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "arbeidstakerens-lonn";

const arbeidstakerensLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.boolean({
    message:
      "Du må svare på om du betaler all lønn og eventuelle naturalytelser i utsendingsperioden",
  }),
  virksomheterSomUtbetalerLonnOgNaturalytelser: z
    .object({
      norskeVirksomheter: z
        .array(
          z.object({
            organisasjonsnummer: z
              .string()
              .min(1, "Organisasjonsnummer er påkrevd")
              .regex(/^\d{9}$/, "Organisasjonsnummer må være 9 siffer"),
          }),
        )
        .optional(),
      utenlandskeVirksomheter: z
        .array(
          z.object({
            navn: z.string().min(1, "Navn på virksomhet er påkrevd"),
            organisasjonsnummer: z.string().optional(),
            vegnavnOgHusnummer: z
              .string()
              .min(1, "Vegnavn og husnummer er påkrevd"),
            bygning: z.string().optional(),
            postkode: z.string().optional(),
            byStedsnavn: z.string().optional(),
            region: z.string().optional(),
            land: z.string().min(1, "Land er påkrevd"),
            tilhorerSammeKonsern: z.boolean({
              message: "Du må svare på om virksomheten tilhører samme konsern",
            }),
          }),
        )
        .optional(),
    })
    .optional(),
});

type ArbeidstakerensLonnFormData = z.infer<typeof arbeidstakerensLonnSchema>;

export function ArbeidstakerensLonnSteg() {
  const navigate = useNavigate();

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
          message:
            "Du må legge til minst én virksomhet når du ikke betaler all lønn selv",
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
            customNesteKnapp: { tekst: "Lagre og fortsett", type: "submit" },
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden"
            legend="Utbetaler du som arbeidsgiver all lønn og eventuelle naturalytelser i utsendingsperioden?"
          />

          {arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden ===
            false && (
            <VStack className="mt-4" gap="space-8">
              <Label>Hvem utbetaler lønnen og eventuelle naturalytelser?</Label>
              <Detail>
                Legg til norske og/eller utenlandske virksomheter som utbetaler
                lønnen og eventuelle naturalytelser
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
                  {errors.virksomheterSomUtbetalerLonnOgNaturalytelser.message}
                </ErrorMessage>
              )}
            </VStack>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
