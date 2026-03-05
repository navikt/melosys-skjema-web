import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { PeriodeFormPart } from "~/components/date/PeriodeFormPart.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postUtsendingsperiodeOgLand,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type { UtsendingsperiodeOgLandDto } from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import type { SkjemaData } from "../types.ts";
import { utsendingsperiodeOgLandSchema } from "./utsendingsperiodeOgLandStegSchema.ts";

export const stepKey = "utsendingsperiode-og-land";

// utsendingsperiodeOgLand lives on the base type, so all 3 variants have it
function getUtsendingsperiodeOgLand(
  data?: SkjemaData,
): UtsendingsperiodeOgLandDto | undefined {
  if (!data) return undefined;
  return data.utsendingsperiodeOgLand;
}

// Date range constants for assignment period selection
const YEARS_FORWARD_FROM_CURRENT = 100;

function UtsendingsperiodeOgLandStegContent({
  skjemaId,
  stegData,
  stegRekkefolge,
}: {
  skjemaId: string;
  stegData?: UtsendingsperiodeOgLandDto;
  stegRekkefolge: StegRekkefolgeItem[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

  const utsendelseLandFelt = getFelt(
    "utenlandsoppdragetArbeidstaker",
    "utsendelsesLand",
  );
  const utsendelsePeriodeFelt = getFelt(
    "utenlandsoppdragetArbeidstaker",
    "utsendelsePeriode",
  );

  const formMethods = useForm({
    resolver: zodResolver(utsendingsperiodeOgLandSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const { handleSubmit } = formMethods;

  const dateLimits = {
    // Dato norge ble EØS medlem
    fromDate: new Date(1995, 0, 1),
    toDate: new Date(
      new Date().getFullYear() + YEARS_FORWARD_FROM_CURRENT,
      11,
      31,
    ),
  };

  const registerUtsendingsperiodeOgLandMutation = useMutation({
    mutationFn: (data: UtsendingsperiodeOgLandDto) => {
      return postUtsendingsperiodeOgLand(skjemaId, data);
    },
    onSuccess: async () => {
      await invalidateSkjemaQuery(skjemaId);
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

  const onSubmit = (data: UtsendingsperiodeOgLandDto) => {
    registerUtsendingsperiodeOgLandMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            stegRekkefolge,
          }}
          nesteKnapp={
            <NesteStegKnapp
              loading={registerUtsendingsperiodeOgLandMutation.isPending}
            />
          }
        >
          <LandVelgerFormPart
            className="mt-4"
            formFieldName="utsendelseLand"
            label={utsendelseLandFelt.label}
          />

          <PeriodeFormPart
            className="mt-6"
            defaultFraDato={
              stegData?.utsendelsePeriode?.fraDato
                ? new Date(stegData.utsendelsePeriode.fraDato)
                : undefined
            }
            defaultTilDato={
              stegData?.utsendelsePeriode?.tilDato
                ? new Date(stegData.utsendelsePeriode.tilDato)
                : undefined
            }
            formFieldName="utsendelsePeriode"
            label={utsendelsePeriodeFelt.label}
            tilDatoDescription={utsendelsePeriodeFelt.hjelpetekst}
            {...dateLimits}
          />
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function UtsendingsperiodeOgLandSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => (
        <UtsendingsperiodeOgLandStegContent
          skjemaId={skjema.id}
          stegData={getUtsendingsperiodeOgLand(skjema.data)}
          stegRekkefolge={STEG_REKKEFOLGE[skjema.metadata.skjemadel]}
        />
      )}
    </SkjemaStegLoader>
  );
}
