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
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postArbeidssituasjon,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type { ArbeidssituasjonDto } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import {
  isArbeidstakerData,
  isCombinedData,
  type SkjemaData,
} from "../types.ts";
import { arbeidssituasjonSchema } from "./arbeidssituasjonStegSchema.ts";

export const stepKey = "arbeidssituasjon";

function getArbeidssituasjon(
  data?: SkjemaData,
): ArbeidssituasjonDto | undefined {
  if (!data) return undefined;
  if (isArbeidstakerData(data)) return data.arbeidssituasjon;
  if (isCombinedData(data)) return data.arbeidstakersData?.arbeidssituasjon;
  return undefined;
}

type ArbeidssituasjonFormData = z.infer<typeof arbeidssituasjonSchema>;

function ArbeidssituasjonStegContent({
  skjemaId,
  stegData,
  stegRekkefolge,
}: {
  skjemaId: string;
  stegData?: ArbeidssituasjonDto;
  stegRekkefolge: StegRekkefolgeItem[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidstakerSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

  const harVaertFelt = getFelt(
    "arbeidssituasjon",
    "harVaertEllerSkalVaereILonnetArbeidFoerUtsending",
  );
  const aktivitetFelt = getFelt(
    "arbeidssituasjon",
    "aktivitetIMaanedenFoerUtsendingen",
  );
  const skalJobbeFelt = getFelt(
    "arbeidssituasjon",
    "skalJobbeForFlereVirksomheter",
  );
  const virksomheterFelt = getFelt(
    "arbeidssituasjon",
    "virksomheterArbeidstakerJobberForIutsendelsesPeriode",
  );

  const formMethods = useForm({
    resolver: zodResolver(arbeidssituasjonSchema),
    ...(stegData && { defaultValues: stegData }),
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
      return postArbeidssituasjon(skjemaId, data);
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjemaId);
      const nextStep = getNextStep(stepKey, stegRekkefolge);
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjemaId },
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
            stegRekkefolge: stegRekkefolge,
          }}
          nesteKnapp={
            <NesteStegKnapp loading={postArbeidssituasjonMutation.isPending} />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harVaertEllerSkalVaereILonnetArbeidFoerUtsending"
            legend={harVaertFelt.label}
          />

          {harVaertEllerSkalVaereILonnetArbeidFoerUtsending === false && (
            <Textarea
              className="mt-4"
              description={aktivitetFelt.hjelpetekst}
              error={translateError(
                errors.aktivitetIMaanedenFoerUtsendingen?.message,
              )}
              label={aktivitetFelt.label}
              {...register("aktivitetIMaanedenFoerUtsendingen")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="skalJobbeForFlereVirksomheter"
            legend={skalJobbeFelt.label}
          />

          {skalJobbeForFlereVirksomheter && (
            <NorskeOgUtenlandskeVirksomheterFormPart
              description={virksomheterFelt.hjelpetekst}
              fieldName="virksomheterArbeidstakerJobberForIutsendelsesPeriode"
              includeAnsettelsesform
              label={virksomheterFelt.label}
            />
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function ArbeidssituasjonSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => (
        <ArbeidssituasjonStegContent
          skjemaId={skjema.id}
          stegData={getArbeidssituasjon(skjema.data)}
          stegRekkefolge={STEG_REKKEFOLGE[skjema.metadata.skjemadel]}
        />
      )}
    </SkjemaStegLoader>
  );
}
