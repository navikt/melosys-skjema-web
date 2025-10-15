import { zodResolver } from "@hookform/resolvers/zod";
import { FileUpload, Textarea } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { postTilleggsopplysninger } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidstakersSkjemaDto,
  TilleggsopplysningerDto,
} from "~/types/melosysSkjemaTypes.ts";

import { ArbeidstakerStegLoader } from "./components/ArbeidstakerStegLoader.tsx";
import { tilleggsopplysningerSchema } from "./tilleggsopplysningerStegSchema.ts";

const stepKey = "tilleggsopplysninger";

type TilleggsopplysningerFormData = z.infer<typeof tilleggsopplysningerSchema>;

interface TilleggsopplysningerStegContentProps {
  skjema: ArbeidstakersSkjemaDto;
}

function TilleggsopplysningerStegContent({
  skjema,
}: TilleggsopplysningerStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const lagretSkjemadataForSteg = skjema.data?.tilleggsopplysninger;

  const formMethods = useForm({
    resolver: zodResolver(tilleggsopplysningerSchema),
    defaultValues: {
      ...lagretSkjemadataForSteg,
    },
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

  const postTilleggsopplysningerMutation = useMutation({
    mutationFn: (data: TilleggsopplysningerFormData) => {
      return postTilleggsopplysninger(
        skjema.id,
        data as TilleggsopplysningerDto,
      );
    },
    onSuccess: () => {
      const nextStep = getNextStep(stepKey, ARBEIDSTAKER_STEG_REKKEFOLGE);
      if (nextStep) {
        const nextRoute = nextStep.route.replace("$id", skjema.id);
        navigate({ to: nextRoute });
      }
    },
    onError: () => {
      toast.error("Kunne ikke lagre tilleggsopplysninger. Prøv igjen.");
    },
  });

  const onSubmit = (data: TilleggsopplysningerFormData) => {
    postTilleggsopplysningerMutation.mutate(data);
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
              loading: postTilleggsopplysningerMutation.isPending,
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

interface TilleggsopplysningerStegProps {
  id: string;
}

export function TilleggsopplysningerSteg({
  id,
}: TilleggsopplysningerStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <TilleggsopplysningerStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}
