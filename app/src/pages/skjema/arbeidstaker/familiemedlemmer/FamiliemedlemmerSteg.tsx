import { zodResolver } from "@hookform/resolvers/zod";
import { GuidePanel } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useInvalidateArbeidstakersSkjemaQuery } from "~/hooks/useInvalidateArbeidstakersSkjemaQuery.ts";
import { postFamiliemedlemmer } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidstakersSkjemaDto,
  FamiliemedlemmerDto,
} from "~/types/melosysSkjemaTypes.ts";

import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { familiemedlemmerSchema } from "./familiemedlemmerStegSchema.ts";

export const stepKey = "familiemedlemmer";

type FamiliemedlemmerFormData = z.infer<typeof familiemedlemmerSchema>;

interface FamiliemedlemmerStegContentProps {
  skjema: ArbeidstakersSkjemaDto;
}

function FamiliemedlemmerStegContent({
  skjema,
}: FamiliemedlemmerStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidstakerSkjemaQuery =
    useInvalidateArbeidstakersSkjemaQuery();

  const lagretSkjemadataForSteg = skjema.data?.familiemedlemmer;

  const formMethods = useForm({
    resolver: zodResolver(familiemedlemmerSchema),
    defaultValues: {
      ...lagretSkjemadataForSteg,
    },
  });

  const { handleSubmit, control } = formMethods;
  const sokerForBarnUnder18SomSkalVaereMed = useWatch({
    control,
    name: "sokerForBarnUnder18SomSkalVaereMed",
  });
  const harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad = useWatch(
    {
      control,
      name: "harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad",
    },
  );

  const postFamiliemedlemmerMutation = useMutation({
    mutationFn: (data: FamiliemedlemmerFormData) => {
      return postFamiliemedlemmer(skjema.id, data as FamiliemedlemmerDto);
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

  const onSubmit = (data: FamiliemedlemmerFormData) => {
    postFamiliemedlemmerMutation.mutate(data);
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
              loading: postFamiliemedlemmerMutation.isPending,
            },
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="sokerForBarnUnder18SomSkalVaereMed"
            legend={t(
              "familiemedlemmerSteg.sokerDuForBarnUnder18SomSkalVaereMed",
            )}
          />

          {sokerForBarnUnder18SomSkalVaereMed && (
            <GuidePanel className="mt-4">
              {t("familiemedlemmerSteg.duMaLageEgenSoknadForBarna")}
            </GuidePanel>
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad"
            legend={t(
              "familiemedlemmerSteg.harDuEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad",
            )}
          />

          {harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad && (
            <GuidePanel className="mt-4">
              {t(
                "familiemedlemmerSteg.duMaLageEgenSoknadForEktefellePartnerSamboerEllerBarnOver18",
              )}
            </GuidePanel>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

interface FamiliemedlemmerStegProps {
  id: string;
}

export function FamiliemedlemmerSteg({ id }: FamiliemedlemmerStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <FamiliemedlemmerStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}
