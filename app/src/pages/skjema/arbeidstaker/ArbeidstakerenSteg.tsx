import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/DatePickerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { getNextStep } from "~/pages/skjema/arbeidsgiver/stegRekkefølge.ts";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

const stepKey = "arbeidstakeren";

const arbeidstakerSchema = z
  .object({
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

  const onSubmit = (data: ArbeidstakerFormData) => {
    // Fjerner console.log når vi har endepunkt å sende data til
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey, []);
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
            stegRekkefolge: [],
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
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
