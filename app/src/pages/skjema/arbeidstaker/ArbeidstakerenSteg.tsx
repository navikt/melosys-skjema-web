import { zodResolver } from "@hookform/resolvers/zod";
import { Select, TextField, VStack } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/DatePickerFormPart.tsx";
import { NorskeVirksomheterFormPart } from "~/components/NorskeVirksomheterFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/UtenlandskeVirksomheterFormPart.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";

const stepKey = "arbeidstakeren";

const AKTIVITET_OPTIONS = [
  { value: "studier", label: "Studier" },
  { value: "ferie", label: "Ferie" },
  { value: "selvstendig-virksomhet", label: "Selvstendig virksomhet" },
  { value: "kontantytelse-fra-nav", label: "Mottok kontantytelse fra Nav" },
] as const;

const arbeidstakerSchema = z
  .object({
    harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.boolean({
      message:
        "Du må svare på om du har vært eller skal være i lønnet arbeid i Norge før utsending",
    }),
    aktivitetIMaanedenFoerUtsendingen: z.string().optional(),
    skalJobbeForFlereVirksomheter: z.boolean({
      message:
        "Du må svare på om du skal jobbe for flere virksomheter i perioden",
    }),
    norskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode: z
      .array(
        z.object({
          organisasjonsnummer: z
            .string()
            .min(1, "Organisasjonsnummer er påkrevd")
            .regex(/^\d{9}$/, "Organisasjonsnummer må være 9 siffer"),
        }),
      )
      .optional(),
    utenlandskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode: z
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
    harNorskFodselsnummer: z.boolean({
      message: "Du må svare på om arbeidstakeren har norsk fødselsnummer",
    }),
    fodselsnummer: z.string().optional(),
    fornavn: z.string().optional(),
    etternavn: z.string().optional(),
    fodselsdato: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.harNorskFodselsnummer) {
        return data.fodselsnummer && data.fodselsnummer.length > 0;
      }
      return true;
    },
    {
      message:
        "Fødselsnummer eller d-nummer er påkrevd når arbeidstakeren har norsk fødselsnummer",
      path: ["fodselsnummer"],
    },
  )
  .refine(
    (data) => {
      if (data.fodselsnummer && data.fodselsnummer.length > 0) {
        return /^\d{11}$/.test(data.fodselsnummer);
      }
      return true;
    },
    {
      message: "Fødselsnummer eller d-nummer må være 11 siffer",
      path: ["fodselsnummer"],
    },
  )
  .refine(
    (data) => {
      if (!data.harNorskFodselsnummer) {
        return data.fornavn && data.fornavn.length >= 2;
      }
      return true;
    },
    {
      message: "Fornavn er påkrevd og må være minst 2 tegn",
      path: ["fornavn"],
    },
  )
  .refine(
    (data) => {
      if (!data.harNorskFodselsnummer) {
        return data.etternavn && data.etternavn.length >= 2;
      }
      return true;
    },
    {
      message: "Etternavn er påkrevd og må være minst 2 tegn",
      path: ["etternavn"],
    },
  )
  .refine(
    (data) => {
      if (!data.harNorskFodselsnummer) {
        return data.fodselsdato && data.fodselsdato.length > 0;
      }
      return true;
    },
    {
      message: "Fødselsdato er påkrevd",
      path: ["fodselsdato"],
    },
  )
  .refine(
    (data) => {
      if (!data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending) {
        const validOptions = AKTIVITET_OPTIONS.map(
          (aktivitetOption) => aktivitetOption.value,
        );
        return (
          data.aktivitetIMaanedenFoerUtsendingen &&
          (validOptions as string[]).includes(
            data.aktivitetIMaanedenFoerUtsendingen,
          )
        );
      }
      return true;
    },
    {
      message: "Du må velge en aktivitet når du ikke har vært i lønnet arbeid",
      path: ["aktivitetIMaanedenFoerUtsendingen"],
    },
  );

type ArbeidstakerFormData = z.infer<typeof arbeidstakerSchema>;

export function ArbeidstakerenSteg() {
  const navigate = useNavigate();

  const formMethods = useForm<ArbeidstakerFormData>({
    resolver: zodResolver(arbeidstakerSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = formMethods;

  const harNorskFodselsnummer = watch("harNorskFodselsnummer");
  const harVaertEllerSkalVaereILonnetArbeidFoerUtsending = watch(
    "harVaertEllerSkalVaereILonnetArbeidFoerUtsending",
  );
  const skalJobbeForFlereVirksomheter = watch("skalJobbeForFlereVirksomheter");

  const onSubmit = (data: ArbeidstakerFormData) => {
    // Fjerner console.log når vi har endepunkt å sende data til
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey, ARBEIDSTAKER_STEG_REKKEFOLGE);
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
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harNorskFodselsnummer"
            legend="Har arbeidstakeren norsk fødselsnummer eller d-nummer?"
          />

          {harNorskFodselsnummer && (
            <TextField
              className="mt-4"
              error={errors.fodselsnummer?.message}
              label="Arbeidstakerens fødselsnummer eller d-nummer"
              size="medium"
              style={{ maxWidth: "160px" }}
              {...register("fodselsnummer")}
            />
          )}

          {harNorskFodselsnummer === false && (
            <>
              <TextField
                className="mt-4 max-w-md"
                error={errors.fornavn?.message}
                label="Arbeidstakerens fornavn"
                {...register("fornavn")}
              />

              <TextField
                className="mt-4 max-w-md"
                error={errors.etternavn?.message}
                label="Arbeidstakerens etternavn"
                {...register("etternavn")}
              />

              <DatePickerFormPart
                className="mt-4"
                formFieldName="fodselsdato"
                label="Arbeidstakerens fødselsdato"
              />
            </>
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harVaertEllerSkalVaereILonnetArbeidFoerUtsending"
            legend="Har du vært eller skal du være i lønnet arbeid i Norge i minst én måned rett før utsendingen?"
          />

          {harVaertEllerSkalVaereILonnetArbeidFoerUtsending === false && (
            <Select
              className="mt-4"
              error={errors.aktivitetIMaanedenFoerUtsendingen?.message}
              label="Aktivitet (TODO: finne en bra label her)"
              style={{ width: "fit-content" }}
              {...register("aktivitetIMaanedenFoerUtsendingen")}
            >
              <option value="">Velg aktivitet</option>
              {AKTIVITET_OPTIONS.map((aktivitetOption) => (
                <option
                  key={aktivitetOption.value}
                  value={aktivitetOption.value}
                >
                  {aktivitetOption.label}
                </option>
              ))}
            </Select>
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="skalJobbeForFlereVirksomheter"
            legend="Skal du jobbe for flere virksomheter i perioden du søker for?"
          />

          {skalJobbeForFlereVirksomheter === true && (
            <VStack className="mt-4" style={{ gap: "var(--a-spacing-4)" }}>
              <NorskeVirksomheterFormPart fieldName="norskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode" />

              <UtenlandskeVirksomheterFormPart fieldName="utenlandskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode" />
            </VStack>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
