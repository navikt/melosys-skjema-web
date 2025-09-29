import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea, TextField } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";

import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "skatteforhold-og-inntekt";

const skatteforholdOgInntektSchema = z
  .object({
    erSkattepliktigTilNorgeIHeleutsendingsperioden: z.boolean({
      message:
        "Du må svare på om du er skattepliktig til Norge i hele utsendingsperioden",
    }),
    mottarPengestotteFraAnnetEosLandEllerSveits: z.boolean({
      message:
        "Du må svare på om du mottar pengestøtte fra et annet EØS-land eller Sveits",
    }),
    pengestotteSomMottasFraAndreLandBeskrivelse: z.string().optional(),
    landSomUtbetalerPengestotte: z.string().optional(),
    pengestotteSomMottasFraAndreLandBelop: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.mottarPengestotteFraAnnetEosLandEllerSveits) {
        return (
          data.pengestotteSomMottasFraAndreLandBeskrivelse &&
          data.pengestotteSomMottasFraAndreLandBeskrivelse.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Du må beskrive hva slags pengestøtte du mottar",
      path: ["pengestotteSomMottasFraAndreLandBeskrivelse"],
    },
  )
  .refine(
    (data) => {
      if (data.mottarPengestotteFraAnnetEosLandEllerSveits) {
        return (
          data.landSomUtbetalerPengestotte &&
          data.landSomUtbetalerPengestotte.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Du må velge hvilket land som utbetaler pengestøtten",
      path: ["landSomUtbetalerPengestotte"],
    },
  )
  .refine(
    (data) => {
      if (data.mottarPengestotteFraAnnetEosLandEllerSveits) {
        if (
          !data.pengestotteSomMottasFraAndreLandBelop ||
          data.pengestotteSomMottasFraAndreLandBelop.trim().length === 0
        ) {
          return false;
        }
        const amount = Number.parseFloat(
          data.pengestotteSomMottasFraAndreLandBelop,
        );
        return !Number.isNaN(amount) && amount > 0;
      }
      return true;
    },
    {
      message: "Du må oppgi et gyldig beløp som er større enn 0",
      path: ["pengestotteSomMottasFraAndreLandBelop"],
    },
  );

type SkatteforholdOgInntektFormData = z.infer<
  typeof skatteforholdOgInntektSchema
>;

export function SkatteforholdOgInntektSteg() {
  const navigate = useNavigate();

  const formMethods = useForm<SkatteforholdOgInntektFormData>({
    resolver: zodResolver(skatteforholdOgInntektSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = formMethods;

  const mottarPengestotteFraAnnetEosLandEllerSveits = watch(
    "mottarPengestotteFraAnnetEosLandEllerSveits",
  );

  const onSubmit = (data: SkatteforholdOgInntektFormData) => {
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey, ARBEIDSTAKER_STEG_REKKEFOLGE);
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
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
            customNesteKnapp: { tekst: "Lagre og fortsett", type: "submit" },
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="erSkattepliktigTilNorgeIHeleutsendingsperioden"
            legend="Er du skattepliktig til Norge i hele utsendingsperioden?"
          />

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="mottarPengestotteFraAnnetEosLandEllerSveits"
            legend="Mottar du pengestøtte fra et annet EØS-land eller Sveits?"
          />

          {mottarPengestotteFraAnnetEosLandEllerSveits === true && (
            <>
              <LandVelgerFormPart
                className="mt-4"
                formFieldName="landSomUtbetalerPengestotte"
                label="Fra hvilket land mottar du pengestøtte?"
              />

              <TextField
                className="mt-4"
                description="Oppgi beløpet i norske kroner"
                error={errors.pengestotteSomMottasFraAndreLandBelop?.message}
                inputMode="decimal"
                label="Hvor mye penger mottar du brutto per måned"
                {...register("pengestotteSomMottasFraAndreLandBelop")}
              />

              <Textarea
                className="mt-4"
                error={
                  errors.pengestotteSomMottasFraAndreLandBeskrivelse?.message
                }
                label="Hva slags pengestøtte mottar du"
                {...register("pengestotteSomMottasFraAndreLandBeskrivelse")}
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
