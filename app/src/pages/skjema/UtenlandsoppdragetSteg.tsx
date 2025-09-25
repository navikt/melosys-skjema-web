import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/DatePickerFormPart";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

import { getNextStep } from "./stepConfig";

const stepKey = "utenlandsoppdraget";

// Date range constants for assignment period selection
const YEARS_BACK_FROM_CURRENT = 1;
const YEARS_FORWARD_FROM_CURRENT = 5;

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
    arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: z
      .boolean()
      .optional(),
    utenlandsoppholdetsBegrunnelse: z.string().optional(),
    ansettelsesforholdBeskrivelse: z.string().optional(),
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
      if (!data.arbeidsgiverHarOppdragILandet) {
        return (
          data.utenlandsoppholdetsBegrunnelse &&
          data.utenlandsoppholdetsBegrunnelse.trim() !== ""
        );
      }
      return true;
    },
    {
      message:
        "Begrunnelse er påkrevd når arbeidsgiver ikke har oppdrag i landet",
      path: ["utenlandsoppholdetsBegrunnelse"],
    },
  )
  .refine(
    (data) => {
      if (!data.arbeidstakerForblirAnsattIHelePerioden) {
        return (
          data.ansettelsesforholdBeskrivelse &&
          data.ansettelsesforholdBeskrivelse.trim() !== ""
        );
      }
      return true;
    },
    {
      message: "Beskrivelse av ansettelsesforhold er påkrevd",
      path: ["ansettelsesforholdBeskrivelse"],
    },
  )
  .refine(
    (data) => {
      if (data.arbeidstakerBleAnsattForUtenlandsoppdraget) {
        return (
          data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget !==
          undefined
        );
      }
      return true;
    },
    {
      message:
        "Du må svare på om arbeidstakeren vil arbeide for virksomheten i Norge etter oppdraget",
      path: ["arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"],
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
    fromDate: new Date(
      new Date().getFullYear() - YEARS_BACK_FROM_CURRENT,
      0,
      1,
    ),
    toDate: new Date(
      new Date().getFullYear() + YEARS_FORWARD_FROM_CURRENT,
      11,
      31,
    ),
  };

  const arbeidstakerErstatterAnnenPerson = watch(
    "arbeidstakerErstatterAnnenPerson",
  );
  const arbeidsgiverHarOppdragILandet = watch("arbeidsgiverHarOppdragILandet");
  const arbeidstakerForblirAnsattIHelePerioden = watch(
    "arbeidstakerForblirAnsattIHelePerioden",
  );
  const arbeidstakerBleAnsattForUtenlandsoppdraget = watch(
    "arbeidstakerBleAnsattForUtenlandsoppdraget",
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
          <LandVelgerFormPart
            className="mt-4"
            formFieldName="utsendelseLand"
            label="Hvilket land sendes arbeidstakeren til?"
          />

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
            formFieldName="arbeidsgiverHarOppdragILandet"
            legend="Har du som arbeidsgiver oppdrag i landet arbeidstaker skal sendes ut til?"
          />

          {arbeidsgiverHarOppdragILandet === false && (
            <Textarea
              className="mt-6"
              error={errors.utenlandsoppholdetsBegrunnelse?.message}
              label="Hvorfor skal arbeidstakeren arbeide i utlandet?"
              {...register("utenlandsoppholdetsBegrunnelse")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerBleAnsattForUtenlandsoppdraget"
            legend="Ble arbeidstaker ansatt på grunn av dette utenlandsoppdraget?"
          />

          {arbeidstakerBleAnsattForUtenlandsoppdraget === true && (
            <RadioGroupJaNeiFormPart
              className="mt-6"
              formFieldName="arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"
              legend="Vil arbeidstakeren arbeide for virksomheten i Norge etter utenlandsoppdraget?"
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerForblirAnsattIHelePerioden"
            legend="Vil arbeidstaker fortsatt være ansatt hos dere i hele utsendingsperioden?"
          />

          {arbeidstakerForblirAnsattIHelePerioden === false && (
            <Textarea
              className="mt-6"
              error={errors.ansettelsesforholdBeskrivelse?.message}
              label="Beskriv arbeidstakerens ansettelsesforhold i utsendingsperioden"
              {...register("ansettelsesforholdBeskrivelse")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
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
