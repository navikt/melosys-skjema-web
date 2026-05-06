import { zodResolver } from "@hookform/resolvers/zod";
import {
  BodyLong,
  Box,
  Checkbox,
  CheckboxGroup,
  Heading,
  Textarea,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

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
import type { SkatteforholdOgInntektDto } from "~/types/melosysSkjemaTypes.ts";
import {
  Skjemadel,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import {
  formaterBelopForVisning,
  stripBelopFormatering,
} from "~/utils/belopFormat.ts";
import { getFieldError } from "~/utils/formErrors.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getSkatteforholdOgInntekt } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { skatteforholdOgInntektSchema } from "./skatteforholdOgInntektStegSchema.ts";

type SkatteforholdOgInntektFormInput = z.input<
  typeof skatteforholdOgInntektSchema
>;

type SkatteforholdOgInntektFormData = z.infer<
  typeof skatteforholdOgInntektSchema
>;

interface CheckboxAlternativ {
  verdi: string;
  label: string;
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
    inntektKildeFelt as unknown as {
      alternativer: CheckboxAlternativ[];
    }
  ).alternativer;

  const hvilkenInntektAlternativer = (
    hvilkenInntektFelt as unknown as {
      alternativer: CheckboxAlternativ[];
    }
  ).alternativer;

  const formMethods = useForm<SkatteforholdOgInntektFormInput>({
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

  const harLoenn = hvilkeTyperInntektHarDu?.LOENN === true;
  const harNorskVirksomhet = inntektKilde?.NORSK_VIRKSOMHET === true;
  const harUtenlandskVirksomhet = inntektKilde?.UTENLANDSK_VIRKSOMHET === true;
  const harNoenVirksomhet = harNorskVirksomhet || harUtenlandskVirksomhet;

  // Vis lønnsinntektsfelt når lønn er huket av OG minst én virksomhet er valgt OG (utenlandsk virksomhet er valgt ELLER ikke skattepliktig)
  const visInntektFelt =
    harLoenn &&
    harNoenVirksomhet &&
    (harUtenlandskVirksomhet || !erSkattepliktig);

  const visInntektFraEgenVirksomhetFelt =
    hvilkeTyperInntektHarDu?.INNTEKT_FRA_EGEN_VIRKSOMHET === true &&
    harNoenVirksomhet;

  // Nullstill feltverdier når de skjules fra visningen
  useEffect(() => {
    if (!visInntektFelt) {
      formMethods.setValue("inntekt", undefined);
      formMethods.clearErrors("inntekt");
    }
  }, [visInntektFelt, formMethods]);

  useEffect(() => {
    if (!visInntektFraEgenVirksomhetFelt) {
      formMethods.setValue("inntektFraEgenVirksomhet", undefined);
      formMethods.clearErrors("inntektFraEgenVirksomhet");
    }
  }, [visInntektFraEgenVirksomhetFelt, formMethods]);

  useEffect(() => {
    if (!mottarPengestotteFraAnnetEosLandEllerSveits) {
      formMethods.setValue("pengestotteSomMottasFraAndreLandBelop", undefined);
      formMethods.setValue("landSomUtbetalerPengestotte", undefined);
      formMethods.setValue(
        "pengestotteSomMottasFraAndreLandBeskrivelse",
        undefined,
      );
      formMethods.clearErrors("pengestotteSomMottasFraAndreLandBelop");
      formMethods.clearErrors("landSomUtbetalerPengestotte");
      formMethods.clearErrors("pengestotteSomMottasFraAndreLandBeskrivelse");
    }
  }, [mottarPengestotteFraAnnetEosLandEllerSveits, formMethods]);

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

  const onSubmit = (data: SkatteforholdOgInntektFormInput) => {
    // Fjern beløpsformatering før innsending
    const cleaned = {
      ...data,
      pengestotteSomMottasFraAndreLandBelop:
        data.pengestotteSomMottasFraAndreLandBelop
          ? stripBelopFormatering(data.pengestotteSomMottasFraAndreLandBelop)
          : data.pengestotteSomMottasFraAndreLandBelop,
      inntekt: data.inntekt
        ? stripBelopFormatering(data.inntekt)
        : data.inntekt,
      inntektFraEgenVirksomhet: data.inntektFraEgenVirksomhet
        ? stripBelopFormatering(data.inntektFraEgenVirksomhet)
        : data.inntektFraEgenVirksomhet,
    };
    postSkatteforholdMutation.mutate(
      cleaned as unknown as SkatteforholdOgInntektFormData,
    );
  };

  /** onBlur-handler som autoformaterer et beløpsfelt for visning */
  const handleBelopBlur = (
    fieldName:
      | "pengestotteSomMottasFraAndreLandBelop"
      | "inntekt"
      | "inntektFraEgenVirksomhet",
  ) => {
    return () => {
      const raw = formMethods.getValues(fieldName);
      if (raw) {
        const stripped = stripBelopFormatering(raw);
        const formatted = formaterBelopForVisning(stripped);
        if (formatted && formatted !== raw) {
          formMethods.setValue(fieldName, formatted);
        }
      }
      formMethods.clearErrors(fieldName);
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

          <Controller
            control={control}
            name="inntektFraNorskEllerUtenlandskVirksomhet"
            render={({ field, fieldState }) => {
              const value = field.value ?? {};
              const selectedValues = Object.entries(value)
                .filter(([, v]) => v)
                .map(([k]) => k);
              return (
                <CheckboxGroup
                  className="mt-4"
                  legend={inntektKildeFelt.label}
                  error={translateError(fieldState.error?.message)}
                  value={selectedValues}
                  onChange={(newValues: string[]) => {
                    const newMap: Record<string, boolean> = {};
                    for (const alt of inntektKildeAlternativer) {
                      newMap[alt.verdi] = newValues.includes(alt.verdi);
                    }
                    field.onChange(newMap);
                  }}
                >
                  {inntektKildeAlternativer.map((alt) => (
                    <Checkbox key={alt.verdi} value={alt.verdi}>
                      {alt.label}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              );
            }}
          />

          <Controller
            control={control}
            name="hvilkeTyperInntektHarDu"
            render={({ field, fieldState }) => {
              const value = field.value ?? {};
              const selectedValues = Object.entries(value)
                .filter(([, v]) => v)
                .map(([k]) => k);
              return (
                <CheckboxGroup
                  className="mt-4"
                  legend={hvilkenInntektFelt.label}
                  error={translateError(fieldState.error?.message)}
                  value={selectedValues}
                  onChange={(newValues: string[]) => {
                    const newMap: Record<string, boolean> = {};
                    for (const alt of hvilkenInntektAlternativer) {
                      newMap[alt.verdi] = newValues.includes(alt.verdi);
                    }
                    field.onChange(newMap);
                  }}
                >
                  {hvilkenInntektAlternativer.map((alt) => (
                    <Checkbox key={alt.verdi} value={alt.verdi}>
                      {alt.label}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              );
            }}
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
                    {inntektFelt.label}
                  </Heading>
                  {inntektFelt.hjelpetekst && (
                    <BodyLong className="mt-1">
                      {inntektFelt.hjelpetekst}
                    </BodyLong>
                  )}
                </div>

                {visInntektFelt && (
                  <TextField
                    className="max-w-xs"
                    error={translateError(getFieldError(errors, "inntekt"))}
                    label={inntektFelt.label}
                    inputMode="decimal"
                    {...register("inntekt")}
                    onBlur={handleBelopBlur("inntekt")}
                  />
                )}

                {visInntektFraEgenVirksomhetFelt && (
                  <TextField
                    className="max-w-xs"
                    error={translateError(
                      getFieldError(errors, "inntektFraEgenVirksomhet"),
                    )}
                    label={inntektFraEgenVirksomhetFelt.label}
                    inputMode="decimal"
                    {...register("inntektFraEgenVirksomhet")}
                    onBlur={handleBelopBlur("inntektFraEgenVirksomhet")}
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
                inputMode="decimal"
                label={belopFelt.label}
                {...register("pengestotteSomMottasFraAndreLandBelop")}
                onBlur={handleBelopBlur(
                  "pengestotteSomMottasFraAndreLandBelop",
                )}
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
