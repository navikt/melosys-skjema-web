import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage, Select } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postArbeidsstedIUtlandet,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  type ArbeidsstedIUtlandetDto,
  ArbeidsstedType,
  Skjemadel,
  type UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto,
  type UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";
import { OffshoreForm } from "./OffshoreForm.tsx";
import { OmBordPaFlyForm } from "./OmBordPaFlyForm.tsx";
import { PaLandForm } from "./PaLandForm.tsx";
import { PaSkipForm } from "./PaSkipForm.tsx";

export const stepKey = "arbeidssted-i-utlandet";

function getArbeidsstedIUtlandet(
  skjemadel: Skjemadel,
  data?: UtsendtArbeidstakerArbeidsgiversSkjemaDataDto | UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto,
): ArbeidsstedIUtlandetDto | undefined {
  if (!data) return undefined;
  if (skjemadel === Skjemadel.ARBEIDSGIVERS_DEL) {
    return (data as UtsendtArbeidstakerArbeidsgiversSkjemaDataDto)
      .arbeidsstedIUtlandet;
  }
  return (data as UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto)
    .arbeidsgiversData?.arbeidsstedIUtlandet;
}

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

function ArbeidsstedIUtlandetStegContent({
  skjemaId,
  stegData,
  stegRekkefolge,
}: {
  skjemaId: string;
  stegData?: ArbeidsstedIUtlandetDto;
  stegRekkefolge: StegRekkefolgeItem[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const { getSeksjon } = useSkjemaDefinisjon();
  const arbeidsstedTypeFelt = getSeksjon("arbeidsstedIUtlandet").felter
    .arbeidsstedType;
  const invalidateArbeidsgiverSkjemaQuery = useInvalidateSkjemaQuery();

  const formMethods = useForm({
    resolver: zodResolver(arbeidsstedIUtlandetSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = formMethods;

  const arbeidsstedType = useWatch({ control, name: "arbeidsstedType" });

  const registerArbeidsstedMutation = useMutation({
    mutationFn: (data: ArbeidsstedIUtlandetFormData) => {
      const apiPayload = data as ArbeidsstedIUtlandetDto;
      return postArbeidsstedIUtlandet(skjemaId, apiPayload);
    },
    onSuccess: () => {
      invalidateArbeidsgiverSkjemaQuery(skjemaId);
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

  const onSubmit = (data: ArbeidsstedIUtlandetFormData) => {
    registerArbeidsstedMutation.mutate(data);
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
            <NesteStegKnapp loading={registerArbeidsstedMutation.isPending} />
          }
        >
          <Select
            className="mt-4"
            error={translateError(errors.arbeidsstedType?.message)}
            label={arbeidsstedTypeFelt.label}
            style={{ width: "fit-content" }}
            {...register("arbeidsstedType")}
          >
            <option value="">
              {t("arbeidsstedIUtlandetSteg.velgArbeidssted")}
            </option>
            {arbeidsstedTypeFelt.alternativer.map((alt) => (
              <option key={alt.verdi} value={alt.verdi}>
                {alt.label}
              </option>
            ))}
          </Select>

          {arbeidsstedType === ArbeidsstedType.PA_LAND && <PaLandForm />}

          {arbeidsstedType === ArbeidsstedType.OFFSHORE && <OffshoreForm />}

          {arbeidsstedType === ArbeidsstedType.PA_SKIP && <PaSkipForm />}

          {arbeidsstedType === ArbeidsstedType.OM_BORD_PA_FLY && (
            <OmBordPaFlyForm />
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function ArbeidsstedIUtlandetSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => {
        const { skjemadel } = skjema.metadata;
        if (
          skjemadel !== Skjemadel.ARBEIDSGIVERS_DEL &&
          skjemadel !== Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL
        ) {
          return (
            <ErrorMessage>
              Steget er ikke tilgjengelig for denne skjemadelen
            </ErrorMessage>
          );
        }
        return (
          <ArbeidsstedIUtlandetStegContent
            skjemaId={skjema.id}
            stegData={getArbeidsstedIUtlandet(skjemadel, skjema.data)}
            stegRekkefolge={STEG_REKKEFOLGE[skjemadel]}
          />
        );
      }}
    </SkjemaStegLoader>
  );
}
