import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea, TextField } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { useTranslateError } from "~/utils/translation.ts";

import { skatteforholdOgInntektSchema } from "./skatteforholdOgInntektStegSchema.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "skatteforhold-og-inntekt";

type SkatteforholdOgInntektFormData = z.infer<
  typeof skatteforholdOgInntektSchema
>;

export function SkatteforholdOgInntektSteg() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();

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
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
            },
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="erSkattepliktigTilNorgeIHeleutsendingsperioden"
            legend={t(
              "skatteforholdOgInntektSteg.erDuSkattepliktigTilNorgeIHeleUtsendingsperioden",
            )}
          />

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="mottarPengestotteFraAnnetEosLandEllerSveits"
            legend={t(
              "skatteforholdOgInntektSteg.mottarDuPengestotteFraEtAnnetEosLandEllerSveits",
            )}
          />

          {mottarPengestotteFraAnnetEosLandEllerSveits === true && (
            <>
              <LandVelgerFormPart
                className="mt-4"
                formFieldName="landSomUtbetalerPengestotte"
                label={t(
                  "skatteforholdOgInntektSteg.fraHvilketLandMottarDuPengestotte",
                )}
              />

              <TextField
                className="mt-4"
                description={t(
                  "skatteforholdOgInntektSteg.oppgiBelopetINorskeKroner",
                )}
                error={translateError(
                  errors.pengestotteSomMottasFraAndreLandBelop?.message,
                )}
                inputMode="decimal"
                label={t(
                  "skatteforholdOgInntektSteg.hvorMyePengerMottarDuBruttoPerManed",
                )}
                {...register("pengestotteSomMottasFraAndreLandBelop")}
              />

              <Textarea
                className="mt-4"
                error={translateError(
                  errors.pengestotteSomMottasFraAndreLandBeskrivelse?.message,
                )}
                label={t(
                  "skatteforholdOgInntektSteg.hvaSlangsPengestotteMottarDu",
                )}
                {...register("pengestotteSomMottasFraAndreLandBeskrivelse")}
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
