import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Detail,
  ErrorMessage,
  Label,
  Tag,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";

import { FjernKnapp } from "~/components/FjernKnapp.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { LeggTilKnapp } from "~/components/LeggTilKnapp.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { getNextStep } from "./stegRekkefølge.ts";

const stepKey = "arbeidstakerens-lonn";

const arbeidstakerensLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.boolean({
    message:
      "Du må svare på om du betaler all lønn og eventuelle naturalytelser i utsendingsperioden",
  }),
  virksomheterSomUtbetalerLonnOgNaturalytelser: z
    .object({
      norskeVirksomheter: z
        .array(
          z.object({
            organisasjonsnummer: z
              .string()
              .min(1, "Organisasjonsnummer er påkrevd")
              .regex(/^\d{9}$/, "Organisasjonsnummer må være 9 siffer"),
          }),
        )
        .optional(),
      utenlandskeVirksomheter: z
        .array(
          z.object({
            navn: z.string().min(1, "Navn på virksomhet er påkrevd"),
            organisasjonsnummer: z.string().optional(),
            vegnavnOgHusnummer: z
              .string()
              .min(1, "Vegnavn og husnummer er påkrevd"),
            bygning: z.string().optional(),
            postkode: z.string().optional(),
            byStedsnavn: z.string().optional(),
            region: z.string().optional(),
            land: z.string().min(1, "Land er påkrevd"),
            tilhorerSammeKonsern: z.boolean({
              message: "Du må svare på om virksomheten tilhører samme konsern",
            }),
          }),
        )
        .optional(),
    })
    .optional(),
});

type ArbeidstakerensLonnFormData = z.infer<typeof arbeidstakerensLonnSchema>;

export function ArbeidstakerensLonnSteg() {
  const navigate = useNavigate();

  const formMethods = useForm<ArbeidstakerensLonnFormData>({
    resolver: zodResolver(arbeidstakerensLonnSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = formMethods;

  const arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden = watch(
    "arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden",
  );

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
          message:
            "Du må legge til minst én virksomhet når du ikke betaler all lønn selv",
        });
        return;
      }
    }

    // Clear any previous errors
    clearErrors("virksomheterSomUtbetalerLonnOgNaturalytelser");

    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey);
    if (nextStep) {
      navigate({ to: nextStep.route });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            customNesteKnapp: { tekst: "Lagre og fortsett", type: "submit" },
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden"
            legend="Utbetaler du som arbeidsgiver all lønn og eventuelle naturalytelser i utsendingsperioden?"
          />

          {arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden ===
            false && (
            <VStack className="mt-4" gap="space-8">
              <Label>Hvem utbetaler lønnen og eventuelle naturalytelser?</Label>
              <Detail>
                Legg til norske og/eller utenlandske virksomheter som utbetaler
                lønnen og eventuelle naturalytelser
              </Detail>

              <NorskeVirksomheterSection />

              <UtenlandskeVirksomheterSection />

              {errors.virksomheterSomUtbetalerLonnOgNaturalytelser && (
                <ErrorMessage className="mt-2">
                  {errors.virksomheterSomUtbetalerLonnOgNaturalytelser.message}
                </ErrorMessage>
              )}
            </VStack>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

function NorskeVirksomheterSection() {
  const { control, register, getFieldState, clearErrors } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "virksomheterSomUtbetalerLonnOgNaturalytelser.norskeVirksomheter",
  });

  const leggTilNorskVirksomhet = () => {
    append({ organisasjonsnummer: "" });
    clearErrors("virksomheterSomUtbetalerLonnOgNaturalytelser");
  };

  const fjernNorskVirksomhet = (index: number) => {
    remove(index);
  };

  return (
    <>
      {fields.map((field, index) => (
        <Box
          background="surface-alt-3-subtle"
          borderRadius="medium"
          className="ml-4"
          key={field.id}
          padding="space-8"
          style={{
            borderLeft: "4px solid var(--a-border-subtle)",
          }}
        >
          <Tag size="small" variant="info">
            Norsk virksomhet
          </Tag>
          <TextField
            className="mt-2"
            error={
              getFieldState(
                `virksomheterSomUtbetalerLonnOgNaturalytelser.norskeVirksomheter.${index}.organisasjonsnummer`,
              ).error?.message
            }
            label="Organisasjonsnummer"
            style={{ maxWidth: "160px" }}
            {...register(
              `virksomheterSomUtbetalerLonnOgNaturalytelser.norskeVirksomheter.${index}.organisasjonsnummer`,
            )}
            size="small"
          />
          <FjernKnapp
            className="mt-2"
            onClick={() => fjernNorskVirksomhet(index)}
            size="small"
          />
        </Box>
      ))}

      <LeggTilKnapp onClick={leggTilNorskVirksomhet}>
        Legg til norsk virksomhet
      </LeggTilKnapp>
    </>
  );
}

function UtenlandskeVirksomheterSection() {
  const { control, register, getFieldState, clearErrors } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter",
  });

  const leggTilUtenlandskVirksomhet = () => {
    append({
      navn: "",
      vegnavnOgHusnummer: "",
      land: "",
    });
    clearErrors("virksomheterSomUtbetalerLonnOgNaturalytelser");
  };

  const fjernUtenlandskVirksomhet = (index: number) => {
    remove(index);
  };

  return (
    <>
      {fields.map((field, index) => (
        <Box
          background="surface-alt-3-subtle"
          borderRadius="medium"
          className="ml-4"
          key={field.id}
          padding="space-8"
          style={{
            borderLeft: "4px solid var(--a-border-subtle)",
          }}
        >
          <Tag size="small" variant="info">
            Utenlandsk virksomhet
          </Tag>

          <VStack className="mt-4" gap="space-6">
            <TextField
              error={
                getFieldState(
                  `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.navn`,
                ).error?.message
              }
              label="Navn på virksomhet"
              {...register(
                `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.navn`,
              )}
              size="small"
            />

            <TextField
              error={
                getFieldState(
                  `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.organisasjonsnummer`,
                ).error?.message
              }
              label="Organisasjonsnummer eller registreringsnummer (valgfritt)"
              {...register(
                `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.organisasjonsnummer`,
              )}
              size="small"
            />

            <TextField
              error={
                getFieldState(
                  `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.vegnavnOgHusnummer`,
                ).error?.message
              }
              label="Vegnavn og husnummer, evt. postboks"
              {...register(
                `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.vegnavnOgHusnummer`,
              )}
              size="small"
            />

            <TextField
              error={
                getFieldState(
                  `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.bygning`,
                ).error?.message
              }
              label="Bygning (valgfritt)"
              {...register(
                `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.bygning`,
              )}
              size="small"
            />

            <TextField
              error={
                getFieldState(
                  `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.postkode`,
                ).error?.message
              }
              label="Postkode (valgfritt)"
              style={{ maxWidth: "120px" }}
              {...register(
                `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.postkode`,
              )}
              size="small"
            />

            <TextField
              error={
                getFieldState(
                  `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.byStedsnavn`,
                ).error?.message
              }
              label="By/stedsnavn (valgfritt)"
              {...register(
                `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.byStedsnavn`,
              )}
              size="small"
            />

            <TextField
              error={
                getFieldState(
                  `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.region`,
                ).error?.message
              }
              label="Region (valgfritt)"
              {...register(
                `virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.region`,
              )}
              size="small"
            />

            <LandVelgerFormPart
              formFieldName={`virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.land`}
              label="Land"
              size="small"
            />

            <RadioGroupJaNeiFormPart
              formFieldName={`virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.${index}.tilhorerSammeKonsern`}
              legend="Tilhører virksomheten samme konsern som den norske arbeidsgiveren?"
              size="small"
            />
          </VStack>

          <FjernKnapp
            className="mt-4"
            onClick={() => fjernUtenlandskVirksomhet(index)}
            size="small"
          />
        </Box>
      ))}

      <LeggTilKnapp onClick={leggTilUtenlandskVirksomhet}>
        Legg til utenlandsk virksomhet
      </LeggTilKnapp>
    </>
  );
}
