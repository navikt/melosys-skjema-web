import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, CheckboxGroup, Textarea, TextField } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
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

/**
 * Formaterer en rå inputverdi som et norsk kronebeløp for visning.
 * - Erstatter punktum med komma
 * - Avrunder til 2 desimaler
 * - Legger til tusenskilletegn (mellomrom)
 * Eksempler: "1234.456" → "1 234,46", "1000000" → "1 000 000,00"
 */
function formaterBelopForVisning(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  // Normaliser: erstatt komma med punktum for parsing
  const normalized = trimmed.replaceAll(/\s/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return value;

  // Avrund til 2 desimaler
  const rounded = parsed.toFixed(2);
  const parts = rounded.split(".");
  const helTall = parts[0] ?? "0";
  const desimaler = parts[1] ?? "00";

  // Legg til tusenskilletegn
  const medTusenSkille = helTall.replaceAll(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${medTusenSkille},${desimaler}`;
}

/**
 * Fjerner formatering (mellomrom) fra et visningsformatert beløp,
 * beholder komma og siffer — formatet melosys-skjema-api forventer: "1234,46"
 */
function stripBelopFormatering(value: string): string {
  return value.replaceAll(/\s/g, "");
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
  const arbeidsinntektKildeFelt = getFelt(
    "skatteforholdOgInntekt",
    "arbeidsinntektFraNorskEllerUtenlandskVirksomhet",
  );
  const hvilkenInntektFelt = getFelt(
    "skatteforholdOgInntekt",
    "hvilkeTyperInntektHarDu",
  );
  const inntekterFraUtenlandskVirksomhetFelt = getFelt(
    "skatteforholdOgInntekt",
    "inntekterFraUtenlandskVirksomhet",
  );
  const inntekterFraEgenVirksomhetFelt = getFelt(
    "skatteforholdOgInntekt",
    "inntekterFraEgenVirksomhet",
  );

  const arbeidsinntektAlternativer = (
    arbeidsinntektKildeFelt as unknown as {
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

  const arbeidsinntektKilde = useWatch({
    control,
    name: "arbeidsinntektFraNorskEllerUtenlandskVirksomhet",
  });

  const hvilkeTyperInntektHarDu = useWatch({
    control,
    name: "hvilkeTyperInntektHarDu",
  });

  const harLoenn = hvilkeTyperInntektHarDu?.LOENN === true;
  const harUtenlandskVirksomhet =
    arbeidsinntektKilde?.UTENLANDSK_VIRKSOMHET === true;

  // Vis lønnsinntektsfelt kun når lønn er huket av OG utenlandsk virksomhet er valgt
  const visInntekterFraUtenlandskVirksomhet =
    harLoenn && harUtenlandskVirksomhet;

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
      inntekterFraUtenlandskVirksomhet: data.inntekterFraUtenlandskVirksomhet
        ? stripBelopFormatering(data.inntekterFraUtenlandskVirksomhet)
        : data.inntekterFraUtenlandskVirksomhet,
      inntekterFraEgenVirksomhet: data.inntekterFraEgenVirksomhet
        ? stripBelopFormatering(data.inntekterFraEgenVirksomhet)
        : data.inntekterFraEgenVirksomhet,
    };
    postSkatteforholdMutation.mutate(
      cleaned as unknown as SkatteforholdOgInntektFormData,
    );
  };

  /** onBlur-handler som autoformaterer et beløpsfelt for visning */
  const handleBelopBlur = (
    fieldName:
      | "pengestotteSomMottasFraAndreLandBelop"
      | "inntekterFraUtenlandskVirksomhet"
      | "inntekterFraEgenVirksomhet",
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
            name="arbeidsinntektFraNorskEllerUtenlandskVirksomhet"
            render={({ field, fieldState }) => {
              const value = field.value ?? {};
              const selectedValues = Object.entries(value)
                .filter(([, v]) => v)
                .map(([k]) => k);
              return (
                <CheckboxGroup
                  className="mt-4"
                  legend={arbeidsinntektKildeFelt.label}
                  error={translateError(fieldState.error?.message)}
                  value={selectedValues}
                  onChange={(newValues: string[]) => {
                    const newMap: Record<string, boolean> = {};
                    for (const alt of arbeidsinntektAlternativer) {
                      newMap[alt.verdi] = newValues.includes(alt.verdi);
                    }
                    field.onChange(newMap);
                  }}
                >
                  {arbeidsinntektAlternativer.map((alt) => (
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

          {visInntekterFraUtenlandskVirksomhet && (
            <TextField
              className="mt-4"
              description={inntekterFraUtenlandskVirksomhetFelt.hjelpetekst}
              error={translateError(
                getFieldError(errors, "inntekterFraUtenlandskVirksomhet"),
              )}
              label={inntekterFraUtenlandskVirksomhetFelt.label}
              inputMode="decimal"
              {...register("inntekterFraUtenlandskVirksomhet")}
              onBlur={handleBelopBlur("inntekterFraUtenlandskVirksomhet")}
            />
          )}

          {hvilkeTyperInntektHarDu?.INNTEKT_FRA_EGEN_VIRKSOMHET && (
            <TextField
              className="mt-4"
              description={inntekterFraEgenVirksomhetFelt.hjelpetekst}
              error={translateError(
                getFieldError(errors, "inntekterFraEgenVirksomhet"),
              )}
              label={inntekterFraEgenVirksomhetFelt.label}
              inputMode="decimal"
              {...register("inntekterFraEgenVirksomhet")}
              onBlur={handleBelopBlur("inntekterFraEgenVirksomhet")}
            />
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
                className="mt-4"
                formFieldName="landSomUtbetalerPengestotte"
                label={landSomUtbetalerFelt.label}
              />

              <TextField
                className="mt-4"
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
