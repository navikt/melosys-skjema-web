import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Heading, HGrid, TextField } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { StegKey } from "~/constants/stegKeys.ts";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postArbeidsgiverensVirksomhetINorge,
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
import { getArbeidsgiverensVirksomhetINorge } from "../stegDataGetters.ts";
import { getStegRekkefolge } from "../stegRekkefølge.ts";
import {
  ANDELFELTER,
  ANTALLFELTER,
  lagArbeidsgiverensVirksomhetSchema,
  skalOppgiSamletVirksomhet,
  tallTilFeltverdi,
} from "./arbeidsgiverensVirksomhetINorgeStegSchema.ts";
import { FELTBREDDE, ProsentFelt } from "./ProsentFelt.tsx";

type ArbeidsgiverensVirksomhetSchema = ReturnType<
  typeof lagArbeidsgiverensVirksomhetSchema
>;
type ArbeidsgiverensVirksomhetFormInput =
  z.input<ArbeidsgiverensVirksomhetSchema>;
type ArbeidsgiverensVirksomhetFormData =
  z.infer<ArbeidsgiverensVirksomhetSchema>;

function ArbeidsgiverensVirksomhetINorgeStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = getStegRekkefolge(skjema);
  const stegData = getArbeidsgiverensVirksomhetINorge(skjema);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidsgiverSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();
  const { antallAnsatte } = skjema.metadata;
  const erBemanningFelt = getFelt(
    "arbeidsgiverensVirksomhetINorge",
    "erArbeidsgiverenBemanningsEllerVikarbyraa",
  );
  const opprettholderDriftFelt = getFelt(
    "arbeidsgiverensVirksomhetINorge",
    "opprettholderArbeidsgiverenVanligDrift",
  );

  const schema = useMemo(
    () => lagArbeidsgiverensVirksomhetSchema(antallAnsatte),
    [antallAnsatte],
  );

  const formMethods = useForm<
    ArbeidsgiverensVirksomhetFormInput,
    unknown,
    ArbeidsgiverensVirksomhetFormData
  >({
    resolver: zodResolver(schema),
    ...(stegData && {
      defaultValues: {
        erArbeidsgiverenBemanningsEllerVikarbyraa:
          stegData.erArbeidsgiverenBemanningsEllerVikarbyraa,
        opprettholderArbeidsgiverenVanligDrift:
          stegData.opprettholderArbeidsgiverenVanligDrift,
        ...Object.fromEntries(
          [...ANTALLFELTER, ...ANDELFELTER].map((felt) => [
            felt,
            tallTilFeltverdi(stegData[felt]),
          ]),
        ),
      },
    }),
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = formMethods;

  const erBemanningsEllerVikarbyraa = useWatch({
    control,
    name: "erArbeidsgiverenBemanningsEllerVikarbyraa",
  });

  const visSamletVirksomhet = skalOppgiSamletVirksomhet(
    antallAnsatte,
    erBemanningsEllerVikarbyraa,
  );

  const registerVirksomhetMutation = useMutation({
    mutationFn: (data: ArbeidsgiverensVirksomhetFormData) => {
      return postArbeidsgiverensVirksomhetINorge(skjema.id, data);
    },
    onSuccess: async () => {
      await invalidateArbeidsgiverSkjemaQuery(skjema.id);
      const nextStep = getNextStep(
        StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
        stegRekkefolge,
      );
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjema.id },
        });
      }
    },
  });

  const onSubmit = (data: ArbeidsgiverensVirksomhetFormData) => {
    registerVirksomhetMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey: StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
            skjema,
          }}
          isSubmitError={registerVirksomhetMutation.isError}
          nesteKnapp={
            <NesteStegKnapp loading={registerVirksomhetMutation.isPending} />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="erArbeidsgiverenBemanningsEllerVikarbyraa"
            legend={erBemanningFelt.label}
          />

          {visSamletVirksomhet && (
            <section
              aria-labelledby="samlet-virksomhet-tittel"
              className="my-8"
            >
              <Heading id="samlet-virksomhet-tittel" level="2" size="small">
                {t(
                  "arbeidsgiverensVirksomhetINorgeSteg.opplysningerOmForetaketsSamledeVirksomhet",
                )}
              </Heading>
              <Box
                background="info-moderateA"
                borderColor="info-subtleA"
                borderRadius="12"
                borderWidth="1"
                className="mt-4"
                padding="space-24"
              >
                <HGrid align="start" columns={{ xs: 1, md: 2 }} gap="space-24">
                  {ANTALLFELTER.map((felt) => (
                    <TextField
                      error={translateError(errors[felt]?.message)}
                      className={FELTBREDDE}
                      inputMode="numeric"
                      key={felt}
                      label={
                        getFelt("arbeidsgiverensVirksomhetINorge", felt).label
                      }
                      maxLength={9}
                      {...register(felt)}
                    />
                  ))}
                  {ANDELFELTER.map((felt) => (
                    <ProsentFelt
                      error={translateError(errors[felt]?.message)}
                      key={felt}
                      label={
                        getFelt("arbeidsgiverensVirksomhetINorge", felt).label
                      }
                      {...register(felt)}
                    />
                  ))}
                </HGrid>
              </Box>
            </section>
          )}

          {!visSamletVirksomhet && (
            <RadioGroupJaNeiFormPart
              className="mt-4"
              description={opprettholderDriftFelt.hjelpetekst}
              formFieldName="opprettholderArbeidsgiverenVanligDrift"
              legend={opprettholderDriftFelt.label}
            />
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function ArbeidsgiverensVirksomhetINorgeSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader
      allowedSkjemadeler={[
        Skjemadel.ARBEIDSGIVERS_DEL,
        Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
      ]}
      id={id}
      skjemaQuery={getSkjemaQuery}
      stepKey={StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE}
    >
      {(skjema) => (
        <ArbeidsgiverensVirksomhetINorgeStegContent skjema={skjema} />
      )}
    </SkjemaStegLoader>
  );
}
