import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Select, useDatepicker } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { formatISO } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

import { getNextStep } from "./stepConfig";

const stepKey = "utenlandsoppdraget";

const utenlandsoppdragSchema = z
  .object({
    land: z
      .string({
        message: "Du må velge hvilket land arbeidstakeren sendes til",
      })
      .min(1, "Du må velge hvilket land arbeidstakeren sendes til"),
    fraDato: z
      .string({
        message: "Fra-dato er påkrevd",
      })
      .min(1, "Fra-dato er påkrevd"),
    tilDato: z
      .string({
        message: "Til-dato er påkrevd",
      })
      .min(1, "Til-dato er påkrevd"),
    arbeidsgiverHarOppdragILandet: z.boolean({
      message: "Du må svare på om dere har oppdrag i landet",
    }),
    arbeidstakerBleAnsattForUtenlandsoppdraget: z.boolean({
      message:
        "Du må svare på om arbeidstaker ble ansatt på grunn av dette utenlandsoppdraget",
    }),
    arbeidstakerForblirAnsattIHelePerioden: z.boolean({
      message:
        "Du må svare på om arbeidstaker vil fortsatt være ansatt i hele utsendingsperioden",
    }),
    arbeidstakerErstatterAnnenPerson: z.boolean({
      message: "Du må svare på om arbeidstaker erstatter en annen person",
    }),
  })
  .refine(
    (data) => {
      if (data.fraDato && data.tilDato) {
        return new Date(data.fraDato) <= new Date(data.tilDato);
      }
      return true;
    },
    {
      message: "Til dato kan ikke være før fra dato",
      path: ["tilDato"],
    },
  );

type UtenlandsoppdragFormData = z.infer<typeof utenlandsoppdragSchema>;

export function UtenlandsoppdragetSteg() {
  const navigate = useNavigate();

  const formMethods = useForm<UtenlandsoppdragFormData>({
    resolver: zodResolver(utenlandsoppdragSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = formMethods;

  const dateLimits = {
    fromDate: new Date(new Date().getFullYear() - 1, 0, 1),
    toDate: new Date(new Date().getFullYear() + 5, 11, 31),
  };

  const fraDatoDatePicker = useDatepicker({
    onDateChange: (date) =>
      setValue(
        "fraDato",
        date ? formatISO(date, { representation: "date" }) : "",
        { shouldValidate: true },
      ),
    ...dateLimits,
  });

  const tilDatoDatePicker = useDatepicker({
    onDateChange: (date) =>
      setValue(
        "tilDato",
        date ? formatISO(date, { representation: "date" }) : "",
        { shouldValidate: true },
      ),
    ...dateLimits,
  });

  const onSubmit = (data: UtenlandsoppdragFormData) => {
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
          <Select
            className="mt-4"
            error={errors.land?.message}
            label="Hvilket land sendes arbeidstakeren til?"
            {...register("land")}
          >
            <option value="">Velg land</option>
            <option value="SV">Sverige</option>
            <option value="DK">Danmark</option>
            <option value="FI">Finland</option>
            <option value="DE">Tyskland</option>
            <option value="FR">Frankrike</option>
            <option value="ES">Spania</option>
            <option value="IT">Italia</option>
            <option value="NL">Nederland</option>
            <option value="BE">Belgia</option>
            <option value="AT">Østerrike</option>
          </Select>

          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold">Utsendingsperiode</h3>

            <DatePicker {...fraDatoDatePicker.datepickerProps} dropdownCaption>
              <DatePicker.Input
                {...fraDatoDatePicker.inputProps}
                className="mt-4"
                error={errors.fraDato?.message}
                label="Fra dato"
              />
            </DatePicker>

            <DatePicker {...tilDatoDatePicker.datepickerProps} dropdownCaption>
              <DatePicker.Input
                {...tilDatoDatePicker.inputProps}
                className="mt-4"
                description="Oppgi omtrentlig dato hvis du ikke vet nøyaktig dato."
                error={errors.tilDato?.message}
                label="Til dato"
              />
            </DatePicker>
          </div>

          <RadioGroupJaNeiFormPart
            className="mt-6"
            error={errors.arbeidsgiverHarOppdragILandet?.message}
            formFieldName="arbeidsgiverHarOppdragILandet"
            legend="Har du som arbeidsgiver oppdrag i landet arbeidstaker skal sendes ut til?"
          />

          <RadioGroupJaNeiFormPart
            className="mt-6"
            error={errors.arbeidstakerBleAnsattForUtenlandsoppdraget?.message}
            formFieldName="arbeidstakerBleAnsattForUtenlandsoppdraget"
            legend="Ble arbeidstaker ansatt på grunn av dette utenlandsoppdraget?"
          />

          <RadioGroupJaNeiFormPart
            className="mt-6"
            error={errors.arbeidstakerForblirAnsattIHelePerioden?.message}
            formFieldName="arbeidstakerForblirAnsattIHelePerioden"
            legend="Vil arbeidstaker fortsatt være ansatt hos dere i hele utsendingsperioden?"
          />

          <RadioGroupJaNeiFormPart
            className="mt-6"
            error={errors.arbeidstakerErstatterAnnenPerson?.message}
            formFieldName="arbeidstakerErstatterAnnenPerson"
            legend="Erstatter arbeidstaker en annen person som var sendt ut for å gjøre det samme arbeidet?"
          />
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
