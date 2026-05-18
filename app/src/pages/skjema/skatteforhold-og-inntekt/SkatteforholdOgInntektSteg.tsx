import { zodResolver } from "@hookform/resolvers/zod";
import {
  BodyLong,
  Box,
  Heading,
  Textarea,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { CheckboxGruppeFormPart } from "~/components/CheckboxGruppeFormPart.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { StegKey } from "~/constants/stegKeys.ts";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postSkatteforholdOgInntekt,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type {
  CheckboxGruppeFeltDefinisjon,
  SkatteforholdOgInntektDto,
} from "~/types/melosysSkjemaTypes.ts";
import {
  Skjemadel,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import {
  BELOP_MAX_LENGTH,
  formaterBelopForVisning,
  stripBelopFormatering,
} from "~/utils/belopFormat.ts";
import { getFieldError } from "~/utils/formErrors.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getSkatteforholdOgInntekt } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import {
  skalInkludereLoennsinntekt,
  skatteforholdOgInntektSchema,
} from "./skatteforholdOgInntektStegSchema.ts";

type SkatteforholdOgInntektFormInput = z.input<
  typeof skatteforholdOgInntektSchema
>;

type SkatteforholdOgInntektFormData = z.infer<
  typeof skatteforholdOgInntektSchema
>;

function erBelopFelt(felt: { format?: string }): boolean {
  return felt.format === "BELOP";
}

function SkatteforholdOgInntektStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const stegData = getSkatteforholdOgInntekt(skjema);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidstakerSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

  const erSkattepliktigFelt = getFelt(
    "skatteforholdOgInntekt",
    "erSkattepliktigTilNorgeIHeleutsendingsperioden",
  );
  const mottarPengestotteFelt = getFelt(
    "skatteforholdOgInntekt",
    "mottarPengestotteFraAnnetEosLandEllerSveits",
  );
  const landSomUtbetalerFelt = getFelt(
    "skatteforholdOgInntekt",
    "landSomUtbetalerPengestotte",
  );
  const belopFelt = getFelt(
    "skatteforholdOgInntekt",
    "pengestotteSomMottasFraAndreLandBelop",
  );
  const beskrivelseFelt = getFelt(
    "skatteforholdOgInntekt",
    "pengestotteSomMottasFraAndreLandBeskrivelse",
  );
  const inntektKildeFelt = getFelt(
    "skatteforholdOgInntekt",
    "inntektFraNorskEllerUtenlandskVirksomhet",
  );
  const hvilkenInntektFelt = getFelt(
    "skatteforholdOgInntekt",
    "hvilkeTyperInntektHarDu",
  );
  const inntektFelt = getFelt("skatteforholdOgInntekt", "inntekt");
  const inntektFraEgenVirksomhetFelt = getFelt(
    "skatteforholdOgInntekt",
    "inntektFraEgenVirksomhet",
  );

  const inntektKildeAlternativer = (
    inntektKildeFelt as CheckboxGruppeFeltDefinisjon
  ).alternativer;

  const hvilkenInntektAlternativer = (
    hvilkenInntektFelt as CheckboxGruppeFeltDefinisjon
  ).alternativer;

  const formMethods = useForm<
    SkatteforholdOgInntektFormInput,
    unknown,
    SkatteforholdOgInntektFormData
  >({
    resolver: zodResolver(skatteforholdOgInntektSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = formMethods;

  const mottarPengestotteFraAnnetEosLandEllerSveits = useWatch({
    control,
    name: "mottarPengestotteFraAnnetEosLandEllerSveits",
  });

  const erSkattepliktig = useWatch({
    control,
    name: "erSkattepliktigTilNorgeIHeleutsendingsperioden",
  });

  const inntektKilde = useWatch({
    control,
    name: "inntektFraNorskEllerUtenlandskVirksomhet",
  });

  const hvilkeTyperInntektHarDu = useWatch({
    control,
    name: "hvilkeTyperInntektHarDu",
  });

  const harLoenn = hvilkeTyperInntektHarDu?.includes("LOENN") ?? false;
  const harEgenVirksomhet =
    hvilkeTyperInntektHarDu?.includes("INNTEKT_FRA_EGEN_VIRKSOMHET") ?? false;
  const harNorskVirksomhet =
    inntektKilde?.includes("NORSK_VIRKSOMHET") ?? false;
  const harUtenlandskVirksomhet =
    inntektKilde?.includes("UTENLANDSK_VIRKSOMHET") ?? false;
  const harNoenVirksomhet = harNorskVirksomhet || harUtenlandskVirksomhet;

  const visInntektFelt =
    harLoenn &&
    harNoenVirksomhet &&
    skalInkludereLoennsinntekt(
      erSkattepliktig,
      harNorskVirksomhet,
      harUtenlandskVirksomhet,
    );

  const visInntektFraEgenVirksomhetFelt =
    harEgenVirksomhet && harNoenVirksomhet;

  const postSkatteforholdMutation = useMutation({
    mutationFn: (data: SkatteforholdOgInntektFormData) => {
      return postSkatteforholdOgInntekt(
        skjema.id,
        data as SkatteforholdOgInntektDto,
      );
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjema.id);
      const nextStep = getNextStep(
        StegKey.SKATTEFORHOLD_OG_INNTEKT,
        stegRekkefolge,
      );
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

  const onSubmit = (data: SkatteforholdOgInntektFormData) => {
    postSkatteforholdMutation.mutate(data);
  };

  const belopOnBlur = (
    fieldName: keyof SkatteforholdOgInntektFormInput & string,
  ) => {
    return () => {
      const raw = formMethods.getValues(fieldName) as string | undefined;
      if (raw) {
        const stripped = stripBelopFormatering(raw);
        const formatted = formaterBelopForVisning(stripped);
        if (formatted && formatted !== raw) {
          formMethods.setValue(fieldName, formatted);
        }
      }
      formMethods.trigger(fieldName);
    };
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey: StegKey.SKATTEFORHOLD_OG_INNTEKT,
            skjema,
          }}
          nesteKnapp={
            <NesteStegKnapp loading={postSkatteforholdMutation.isPending} />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="erSkattepliktigTilNorgeIHeleutsendingsperioden"
            legend={erSkattepliktigFelt.label}
          />

          <CheckboxGruppeFormPart
            className="mt-4"
            formFieldName="inntektFraNorskEllerUtenlandskVirksomhet"
            legend={inntektKildeFelt.label}
            alternativer={inntektKildeAlternativer}
          />

          <CheckboxGruppeFormPart
            className="mt-4"
            formFieldName="hvilkeTyperInntektHarDu"
            legend={hvilkenInntektFelt.label}
            alternativer={hvilkenInntektAlternativer}
          />

          {(visInntektFelt || visInntektFraEgenVirksomhetFelt) && (
            <Box
              className="mt-4"
              background="info-moderateA"
              borderColor="info-subtleA"
              borderWidth="1"
              borderRadius="12"
              padding="space-24"
            >
              <VStack gap="space-16">
                <div>
                  <Heading size="xsmall" level="2">
                    {t("skatteforholdOgInntektSteg.inntektHeading")}
                  </Heading>
                  {inntektFelt.hjelpetekst && (
                    <BodyLong className="mt-1">
                      {inntektFelt.hjelpetekst}
                    </BodyLong>
                  )}
                </div>

                {visInntektFelt && (
                  <TextField
                    description={belopFelt.hjelpetekst}
                    className="max-w-xs"
                    error={translateError(getFieldError(errors, "inntekt"))}
                    label={inntektFelt.label}
                    inputMode="numeric"
                    maxLength={BELOP_MAX_LENGTH}
                    {...register("inntekt", {
                      ...(erBelopFelt(inntektFelt) && {
                        onBlur: belopOnBlur("inntekt"),
                      }),
                    })}
                  />
                )}

                {visInntektFraEgenVirksomhetFelt && (
                  <TextField
                    description={belopFelt.hjelpetekst}
                    className="max-w-xs"
                    error={translateError(
                      getFieldError(errors, "inntektFraEgenVirksomhet"),
                    )}
                    label={inntektFraEgenVirksomhetFelt.label}
                    inputMode="numeric"
                    maxLength={BELOP_MAX_LENGTH}
                    {...register("inntektFraEgenVirksomhet", {
                      ...(erBelopFelt(inntektFraEgenVirksomhetFelt) && {
                        onBlur: belopOnBlur("inntektFraEgenVirksomhet"),
                      }),
                    })}
                  />
                )}
              </VStack>
            </Box>
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            description={mottarPengestotteFelt.hjelpetekst}
            formFieldName="mottarPengestotteFraAnnetEosLandEllerSveits"
            legend={mottarPengestotteFelt.label}
          />

          {mottarPengestotteFraAnnetEosLandEllerSveits && (
            <>
              <LandVelgerFormPart
                className="mt-4 max-w-md"
                formFieldName="landSomUtbetalerPengestotte"
                label={landSomUtbetalerFelt.label}
              />

              <TextField
                className="mt-4 max-w-md"
                description={belopFelt.hjelpetekst}
                error={translateError(
                  getFieldError(
                    errors,
                    "pengestotteSomMottasFraAndreLandBelop",
                  ),
                )}
                inputMode="numeric"
                label={belopFelt.label}
                maxLength={BELOP_MAX_LENGTH}
                {...register("pengestotteSomMottasFraAndreLandBelop", {
                  ...(erBelopFelt(belopFelt) && {
                    onBlur: belopOnBlur(
                      "pengestotteSomMottasFraAndreLandBelop",
                    ),
                  }),
                })}
              />

              <Textarea
                className="mt-4"
                error={translateError(
                  getFieldError(
                    errors,
                    "pengestotteSomMottasFraAndreLandBeskrivelse",
                  ),
                )}
                label={beskrivelseFelt.label}
                {...register("pengestotteSomMottasFraAndreLandBeskrivelse")}
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function SkatteforholdOgInntektSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader
      allowedSkjemadeler={[
        Skjemadel.ARBEIDSTAKERS_DEL,
        Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
      ]}
      id={id}
      skjemaQuery={getSkjemaQuery}
    >
      {(skjema) => <SkatteforholdOgInntektStegContent skjema={skjema} />}
    </SkjemaStegLoader>
  );
}
