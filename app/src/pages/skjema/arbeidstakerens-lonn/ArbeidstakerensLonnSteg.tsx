import { zodResolver } from "@hookform/resolvers/zod";
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
  postArbeidstakerensLonn,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type { ArbeidstakerensLonnDto } from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import {
  isArbeidsgiverData,
  isCombinedData,
  type SkjemaData,
} from "../types.ts";
import { arbeidstakerensLonnSchema } from "./arbeidstakerensLonnStegSchema.ts";

export const stepKey = "arbeidstakerens-lonn";

function getArbeidstakerensLonn(
  data?: SkjemaData,
): ArbeidstakerensLonnDto | undefined {
  if (!data) return undefined;
  if (isArbeidsgiverData(data)) return data.arbeidstakerensLonn;
  if (isCombinedData(data)) return data.arbeidsgiversData?.arbeidstakerensLonn;
  return undefined;
}

type ArbeidstakerensLonnFormData = z.infer<typeof arbeidstakerensLonnSchema>;

function ArbeidstakerensLonnStegContent({
  skjemaId,
  stegData,
  stegRekkefolge,
}: {
  skjemaId: string;
  stegData?: ArbeidstakerensLonnDto;
  stegRekkefolge: StegRekkefolgeItem[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidsgiverSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

  const betalerAllLonnFelt = getFelt(
    "arbeidstakerensLonn",
    "arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden",
  );
  const virksomheterFelt = getFelt(
    "arbeidstakerensLonn",
    "virksomheterSomUtbetalerLonnOgNaturalytelser",
  );

  const formMethods = useForm({
    resolver: zodResolver(arbeidstakerensLonnSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const { handleSubmit, setError, clearErrors, control } = formMethods;

  const arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden = useWatch(
    {
      control,
      name: "arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden",
    },
  );

  const registerArbeidstakerLonnMutation = useMutation({
    mutationFn: (data: ArbeidstakerensLonnFormData) => {
      return postArbeidstakerensLonn(skjemaId, data as ArbeidstakerensLonnDto);
    },
    onSuccess: async () => {
      await invalidateArbeidsgiverSkjemaQuery(skjemaId);
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
          message: t(
            "arbeidstakerenslonnSteg.duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv",
          ),
        });
        return;
      }
    }

    // Clear any previous errors
    clearErrors("virksomheterSomUtbetalerLonnOgNaturalytelser");

    registerArbeidstakerLonnMutation.mutate(data);
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
            <NesteStegKnapp
              loading={registerArbeidstakerLonnMutation.isPending}
            />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden"
            legend={betalerAllLonnFelt.label}
          />

          {arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden ===
            false && (
            <NorskeOgUtenlandskeVirksomheterFormPart
              description={virksomheterFelt.hjelpetekst}
              fieldName="virksomheterSomUtbetalerLonnOgNaturalytelser"
              label={virksomheterFelt.label}
            />
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function ArbeidstakerensLonnSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => (
        <ArbeidstakerensLonnStegContent
          skjemaId={skjema.id}
          stegData={getArbeidstakerensLonn(skjema.data)}
          stegRekkefolge={STEG_REKKEFOLGE[skjema.metadata.skjemadel]}
        />
      )}
    </SkjemaStegLoader>
  );
}
