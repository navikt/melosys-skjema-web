import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { NorskeOgUtenlandskeVirksomheterFormPart } from "~/components/virksomheter/NorskeOgUtenlandskeVirksomheterFormPart.tsx";
import { useInvalidateArbeidstakersSkjemaQuery } from "~/hooks/useInvalidateArbeidstakersSkjemaQuery.ts";
import { postArbeidssituasjon } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { ArbeidstakersSkjemaDto } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { arbeidssituasjonSchema } from "./arbeidssituasjonStegSchema.ts";

export const stepKey = "arbeidssituasjon";

type ArbeidssituasjonFormData = z.infer<typeof arbeidssituasjonSchema>;

interface ArbeidssituasjonStegContentProps {
  skjema: ArbeidstakersSkjemaDto;
}

function ArbeidssituasjonStegContent({
  skjema,
}: ArbeidssituasjonStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidstakerSkjemaQuery =
    useInvalidateArbeidstakersSkjemaQuery();

  const lagretSkjemadataForSteg = skjema.data?.arbeidssituasjon;

  const formMethods = useForm({
    resolver: zodResolver(arbeidssituasjonSchema),
    ...(lagretSkjemadataForSteg && { defaultValues: lagretSkjemadataForSteg }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = formMethods;

  const harVaertEllerSkalVaereILonnetArbeidFoerUtsending = useWatch({
    control,
    name: "harVaertEllerSkalVaereILonnetArbeidFoerUtsending",
  });
  const skalJobbeForFlereVirksomheter = useWatch({
    control,
    name: "skalJobbeForFlereVirksomheter",
  });

  const postArbeidssituasjonMutation = useMutation({
    mutationFn: (data: ArbeidssituasjonFormData) => {
      return postArbeidssituasjon(skjema.id, data);
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjema.id);
      const nextStep = getNextStep(stepKey, ARBEIDSTAKER_STEG_REKKEFOLGE);
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

  const onSubmit = (data: ArbeidssituasjonFormData) => {
    postArbeidssituasjonMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          }}
          nesteKnapp={
            <NesteStegKnapp loading={postArbeidssituasjonMutation.isPending} />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harVaertEllerSkalVaereILonnetArbeidFoerUtsending"
            legend={t(
              "arbeidssituasjonSteg.harDuVaertEllerSkalVaereILonnetArbeidINorgeIMinst1ManedRettForUtsendingen",
            )}
          />

          {harVaertEllerSkalVaereILonnetArbeidFoerUtsending === false && (
            <Textarea
              className="mt-4"
              description={t(
                "arbeidssituasjonSteg.beskriveAktivitetFoerUtsendingBeskrivelse",
              )}
              error={translateError(
                errors.aktivitetIMaanedenFoerUtsendingen?.message,
              )}
              label={t("arbeidssituasjonSteg.beskriveAktivitetFoerUtsending")}
              {...register("aktivitetIMaanedenFoerUtsendingen")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="skalJobbeForFlereVirksomheter"
            legend={t(
              "arbeidssituasjonSteg.skalDuOgsaDriveSelvstendigVirksomhetEllerJobbeForEnAnnenArbeidsgiver",
            )}
          />

          {skalJobbeForFlereVirksomheter && (
            <NorskeOgUtenlandskeVirksomheterFormPart
              description={t(
                "arbeidssituasjonSteg.leggTilVirksomheterDuSkalJobbeForBeskrivelse",
              )}
              fieldName="virksomheterArbeidstakerJobberForIutsendelsesPeriode"
              includeAnsettelsesform
              label={t(
                "arbeidssituasjonSteg.hvemSkalDuJobbeForIUtsendelsesPerioden",
              )}
            />
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

interface ArbeidssituasjonStegProps {
  id: string;
}

export function ArbeidssituasjonSteg({ id }: ArbeidssituasjonStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <ArbeidssituasjonStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}
