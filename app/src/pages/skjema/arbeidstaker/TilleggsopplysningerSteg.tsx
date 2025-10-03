import { zodResolver } from "@hookform/resolvers/zod";
import { FileUpload, Textarea } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";

import { tilleggsopplysningerSchema } from "./tilleggsopplysningerStegSchema.ts";

const stepKey = "tilleggsopplysninger";

export function TilleggsopplysningerSteg() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  type TilleggsopplysningerFormData = z.infer<
    typeof tilleggsopplysningerSchema
  >;

  const formMethods = useForm<TilleggsopplysningerFormData>({
    resolver: zodResolver(tilleggsopplysningerSchema),
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = formMethods;
  const harFlereOpplysningerTilSoknaden = watch(
    "harFlereOpplysningerTilSoknaden",
  );

  const onSubmit = (data: TilleggsopplysningerFormData) => {
    // Fjerner console.log når vi har endepunkt å sende data til
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
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
            },
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harFlereOpplysningerTilSoknaden"
            legend={t(
              "tilleggsopplysningerSteg.harDuNoenFlereOpplysningerTilSoknaden",
            )}
          />

          {harFlereOpplysningerTilSoknaden === true && (
            <Textarea
              {...register("tilleggsopplysningerTilSoknad")}
              className="mt-4"
              error={errors.tilleggsopplysningerTilSoknad?.message}
              label={t(
                "tilleggsopplysningerSteg.beskriveFlereOpplysningerTilSoknaden",
              )}
            />
          )}

          <FileUpload.Dropzone
            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
            className="mt-4"
            description={t(
              "tilleggsopplysningerSteg.lastOppVedleggBeskrivelse",
            )}
            label={t("tilleggsopplysningerSteg.lastOppVedlegg")}
            maxSizeInBytes={10_000_000}
            multiple={true}
            onSelect={() => {}}
          />
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
