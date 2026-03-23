import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, BodyLong, Heading, Textarea } from "@navikt/ds-react";
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
  postArbeidssituasjon,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  Skjemadel,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getArbeidssituasjon } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { arbeidssituasjonSchema } from "./arbeidssituasjonStegSchema.ts";

type ArbeidssituasjonFormData = z.infer<typeof arbeidssituasjonSchema>;

function ArbeidssituasjonStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const stegData = getArbeidssituasjon(skjema);
  const skjemadel = skjema.metadata.skjemadel;
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
      return postArbeidssituasjon(skjema.id, data);
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjema.id);
      const nextStep = getNextStep(StegKey.ARBEIDSSITUASJON, stegRekkefolge);
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
            stepKey: StegKey.ARBEIDSSITUASJON,
            stegRekkefolge: stegRekkefolge,
            skjemaId,
          }}
          nesteKnapp={
            <NesteStegKnapp loading={postArbeidssituasjonMutation.isPending} />
          }
        >
          {skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL && (
            <Alert className="mt-4" variant="info">
              <Heading level="2" size="small" spacing>
                {t("arbeidssituasjonSteg.fullmaktFraArbeidstakerTittel")}
              </Heading>
              <BodyLong>
                {t("arbeidssituasjonSteg.fullmaktFraArbeidstakerBeskrivelse")}
              </BodyLong>
            </Alert>
          )}

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
    <SkjemaStegLoader
      allowedSkjemadeler={[
        Skjemadel.ARBEIDSTAKERS_DEL,
        Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
      ]}
      id={id}
      skjemaQuery={getSkjemaQuery}
    >
      {(skjema) => <ArbeidssituasjonStegContent skjema={skjema} />}
    </SkjemaStegLoader>
  );
}
