import { zodResolver } from "@hookform/resolvers/zod";
import {
  DatePicker,
  Radio,
  RadioGroup,
  TextField,
  useDatepicker,
} from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { formatISO } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

import { getNextStep } from "./stepConfig";

const stepKey = "arbeidstakeren";

const arbeidstakerSchema = z
  .object({
    harNorskFodselsnummer: z.boolean(),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<ArbeidstakerFormData>({
    resolver: zodResolver(arbeidstakerSchema),
  });

  const fodselsdatoDatePicker = useDatepicker({
    onDateChange: (date) =>
      setValue(
        "fodselsdato",
        date ? formatISO(date, { representation: "date" }) : undefined,
      ),
  });

  const harNorskFodselsnummer = watch("harNorskFodselsnummer");

  const onSubmit = (data: ArbeidstakerFormData) => {
    // Fjerner console.log når vi har endepunkt å sende data til
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey);
    if (nextStep) {
      navigate({ to: nextStep.route });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SkjemaSteg
        config={{
          stepKey,
          customNesteKnapp: { tekst: "Lagre og fortsett", type: "submit" },
        }}
      >
        <Controller
          control={control}
          name="harNorskFodselsnummer"
          render={({ field }) => (
            <RadioGroup
              className="mt-4"
              error={errors.harNorskFodselsnummer?.message}
              legend="Har arbeidstakeren norsk fødselsnummer eller d-nummer?"
              onChange={(value) => field.onChange(value === "true")}
              value={field.value === undefined ? "" : field.value.toString()}
            >
              <Radio size="small" value="true">
                Ja
              </Radio>
              <Radio size="small" value="false">
                Nei
              </Radio>
            </RadioGroup>
          )}
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

            <DatePicker
              {...fodselsdatoDatePicker.datepickerProps}
              dropdownCaption
            >
              <DatePicker.Input
                {...fodselsdatoDatePicker.inputProps}
                className="mt-4"
                error={errors.fodselsdato?.message}
                label="Arbeidstakerens fødselsdato"
              />
            </DatePicker>
          </>
        )}
      </SkjemaSteg>
    </form>
  );
}
