import { zodResolver } from "@hookform/resolvers/zod";
import { InformationSquareIcon } from "@navikt/aksel-icons";
import { BodyLong, InfoCard, Link } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { StegKey } from "~/constants/stegKeys.ts";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postFamiliemedlemmer,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  FamiliemedlemmerDto,
  Skjemadel,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getFamiliemedlemmer } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { familiemedlemmerSchema } from "./familiemedlemmerStegSchema.ts";

function FamiliemedlemmerStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const stegData = getFamiliemedlemmer(skjema);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidstakerSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();
  const skalHaMedFelt = getFelt(
    "familiemedlemmer",
    "skalHaMedFamiliemedlemmer",
  );

  const formMethods = useForm({
    resolver: zodResolver(familiemedlemmerSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const { handleSubmit, control } = formMethods;
  const skalHaMedFamiliemedlemmer = useWatch({
    control,
    name: "skalHaMedFamiliemedlemmer",
  });

  const postFamiliemedlemmerMutation = useMutation({
    mutationFn: (data: FamiliemedlemmerDto) => {
      return postFamiliemedlemmer(skjema.id, data);
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjema.id);
      const nextStep = getNextStep(StegKey.FAMILIEMEDLEMMER, stegRekkefolge);
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjema.id },
        });
      }
    },
  });

  const onSubmit = (data: FamiliemedlemmerDto) => {
    postFamiliemedlemmerMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey: StegKey.FAMILIEMEDLEMMER,
            skjema,
          }}
          isSubmitError={postFamiliemedlemmerMutation.isError}
          nesteKnapp={
            <NesteStegKnapp loading={postFamiliemedlemmerMutation.isPending} />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="skalHaMedFamiliemedlemmer"
            legend={skalHaMedFelt.label}
          />

          {skalHaMedFamiliemedlemmer && (
            <InfoCard className="mt-6" data-color="info">
              <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                <InfoCard.Title as="h3">
                  {t("familiemedlemmerSteg.infokortTittel")}
                </InfoCard.Title>
              </InfoCard.Header>
              <InfoCard.Content>
                <div className="flex flex-col gap-6 pb-8">
                  <BodyLong>
                    {t("familiemedlemmerSteg.informasjonOmEgenSoknad")}
                  </BodyLong>
                  <Link
                    href={t("familiemedlemmerSteg.soknadsskjemaLenke")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("familiemedlemmerSteg.soknadsskjemaNavn")}
                  </Link>
                </div>
              </InfoCard.Content>
            </InfoCard>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function FamiliemedlemmerSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader
      allowedSkjemadeler={[
        Skjemadel.ARBEIDSTAKERS_DEL,
        Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
      ]}
      id={id}
      skjemaQuery={getSkjemaQuery}
    >
      {(skjema) => <FamiliemedlemmerStegContent skjema={skjema} />}
    </SkjemaStegLoader>
  );
}
