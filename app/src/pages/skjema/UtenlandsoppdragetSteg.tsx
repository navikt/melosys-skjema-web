import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/DatePickerFormPart";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

import { getNextStep } from "./stepConfig";

const stepKey = "utenlandsoppdraget";

const utenlandsoppdragSchema = z
  .object({
    utsendelseLand: z
      .string({
        message: "Du må velge hvilket land arbeidstakeren sendes til",
      })
      .min(1, "Du må velge hvilket land arbeidstakeren sendes til"),
    arbeidstakerUtsendelseFraDato: z
      .string({
        message: "Fra-dato er påkrevd",
      })
      .min(1, "Fra-dato er påkrevd"),
    arbeidstakerUtsendelseTilDato: z
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
    forrigeArbeidstakerUtsendelseFradato: z.string().optional(),
    forrigeArbeidstakerUtsendelseTilDato: z.string().optional(),
  })
  .refine(
    (data) => {
      // Always validate main dates if both are present
      if (
        data.arbeidstakerUtsendelseFraDato &&
        data.arbeidstakerUtsendelseTilDato
      ) {
        return (
          new Date(data.arbeidstakerUtsendelseFraDato) <=
          new Date(data.arbeidstakerUtsendelseTilDato)
        );
      }
      return true;
    },
    {
      message: "Til dato kan ikke være før fra dato",
      path: ["arbeidstakerUtsendelseTilDato"],
    },
  )
  .refine(
    (data) => {
      // Always validate forrige arbeidstaker dates if both are present
      if (
        data.forrigeArbeidstakerUtsendelseFradato &&
        data.forrigeArbeidstakerUtsendelseTilDato
      ) {
        return (
          new Date(data.forrigeArbeidstakerUtsendelseFradato) <=
          new Date(data.forrigeArbeidstakerUtsendelseTilDato)
        );
      }
      return true;
    },
    {
      message: "Til dato kan ikke være før fra dato",
      path: ["forrigeArbeidstakerUtsendelseTilDato"],
    },
  )
  .refine(
    (data) => {
      if (data.arbeidstakerErstatterAnnenPerson) {
        return (
          data.forrigeArbeidstakerUtsendelseFradato &&
          data.forrigeArbeidstakerUtsendelseFradato !== ""
        );
      }
      return true;
    },
    {
      message: "Fra-dato for forrige arbeidstaker er påkrevd",
      path: ["forrigeArbeidstakerUtsendelseFradato"],
    },
  )
  .refine(
    (data) => {
      if (data.arbeidstakerErstatterAnnenPerson) {
        return (
          data.forrigeArbeidstakerUtsendelseTilDato &&
          data.forrigeArbeidstakerUtsendelseTilDato !== ""
        );
      }
      return true;
    },
    {
      message: "Til-dato for forrige arbeidstaker er påkrevd",
      path: ["forrigeArbeidstakerUtsendelseTilDato"],
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
    watch,
  } = formMethods;

  const dateLimits = {
    fromDate: new Date(new Date().getFullYear() - 1, 0, 1),
    toDate: new Date(new Date().getFullYear() + 5, 11, 31),
  };

  const arbeidstakerErstatterAnnenPerson = watch(
    "arbeidstakerErstatterAnnenPerson",
  );

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
            error={errors.utsendelseLand?.message}
            label="Hvilket land sendes arbeidstakeren til?"
            {...register("utsendelseLand")}
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

            <DatePickerFormPart
              className="mt-4"
              formFieldName="arbeidstakerUtsendelseFraDato"
              label="Fra dato"
              {...dateLimits}
            />

            <DatePickerFormPart
              className="mt-4"
              description="Oppgi omtrentlig dato hvis du ikke vet nøyaktig dato."
              formFieldName="arbeidstakerUtsendelseTilDato"
              label="Til dato"
              {...dateLimits}
            />
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

          {arbeidstakerErstatterAnnenPerson && (
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold">
                Forrige arbeidstakers utsendelse
              </h3>

              <DatePickerFormPart
                className="mt-4"
                formFieldName="forrigeArbeidstakerUtsendelseFradato"
                label="Fra dato"
                {...dateLimits}
              />

              <DatePickerFormPart
                className="mt-4"
                formFieldName="forrigeArbeidstakerUtsendelseTilDato"
                label="Til dato"
                {...dateLimits}
              />
            </div>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
