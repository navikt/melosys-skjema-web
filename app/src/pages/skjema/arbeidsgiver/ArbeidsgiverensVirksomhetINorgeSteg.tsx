import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { getNextStep } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "arbeidsgiverens-virksomhet-i-norge";

const arbeidsgiverensVirksomhetSchema = z
  .object({
    erArbeidsgiverenOffentligVirksomhet: z.boolean({
      message: "Du må svare på om arbeidsgiveren er en offentlig virksomhet",
    }),
    erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean().optional(),
    opprettholderArbeidsgivereVanligDrift: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (!data.erArbeidsgiverenOffentligVirksomhet) {
        return data.erArbeidsgiverenBemanningsEllerVikarbyraa !== undefined;
      }
      return true;
    },
    {
      message:
        "Du må svare på om arbeidsgiveren er et bemannings- eller vikarbyrå",
      path: ["erArbeidsgiverenBemanningsEllerVikarbyraa"],
    },
  )
  .refine(
    (data) => {
      if (!data.erArbeidsgiverenOffentligVirksomhet) {
        return data.opprettholderArbeidsgivereVanligDrift !== undefined;
      }
      return true;
    },
    {
      message:
        "Du må svare på om arbeidsgiveren opprettholder vanlig drift i Norge",
      path: ["opprettholderArbeidsgivereVanligDrift"],
    },
  );

type ArbeidsgiverensVirksomhetFormData = z.infer<
  typeof arbeidsgiverensVirksomhetSchema
>;

export function ArbeidsgiverensVirksomhetINorgeSteg() {
  const navigate = useNavigate();

  const formMethods = useForm<ArbeidsgiverensVirksomhetFormData>({
    resolver: zodResolver(arbeidsgiverensVirksomhetSchema),
  });

  const { handleSubmit, watch } = formMethods;

  const erArbeidsgiverenOffentligVirksomhet = watch(
    "erArbeidsgiverenOffentligVirksomhet",
  );

  const onSubmit = (data: ArbeidsgiverensVirksomhetFormData) => {
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
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
            stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
            customNesteKnapp: { tekst: "Lagre og fortsett", type: "submit" },
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            description="Offentlige virksomheter er statsorganer og underliggende virksomheter, for eksempel departementer og universiteter."
            formFieldName="erArbeidsgiverenOffentligVirksomhet"
            legend="Er arbeidsgiveren en offentlig virksomhet?"
          />

          {erArbeidsgiverenOffentligVirksomhet === false && (
            <>
              <RadioGroupJaNeiFormPart
                className="mt-4"
                formFieldName="erArbeidsgiverenBemanningsEllerVikarbyraa"
                legend="Er arbeidsgiveren et bemannings- eller vikarbyrå?"
              />

              <RadioGroupJaNeiFormPart
                className="mt-4"
                description="Med dette mener vi at arbeidsgiveren fortsatt har aktivitet og ansatte som jobber i Norge i perioden."
                formFieldName="opprettholderArbeidsgivereVanligDrift"
                legend="Opprettholder arbeidsgiveren vanlig drift i Norge?"
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
