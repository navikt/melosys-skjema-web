import { zodResolver } from "@hookform/resolvers/zod";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";

import { getNextStep } from "./stepConfig";

const stepKey = "arbeidsgiverens-virksomhet-i-norge";

const arbeidsgiverensVirksomhetSchema = z
  .object({
    erArbeidsgiverenOffentligVirksomhet: z.boolean(),
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

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<ArbeidsgiverensVirksomhetFormData>({
    resolver: zodResolver(arbeidsgiverensVirksomhetSchema),
  });

  const erArbeidsgiverenOffentligVirksomhet = watch(
    "erArbeidsgiverenOffentligVirksomhet",
  );

  const onSubmit = (data: ArbeidsgiverensVirksomhetFormData) => {
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey);
    if (nextStep) {
      navigate({ to: nextStep.route });
    }
  };

  console.log(watch());

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
          name="erArbeidsgiverenOffentligVirksomhet"
          render={({ field }) => (
            <RadioGroup
              className="mt-4"
              description="Offentlige virksomheter er statsorganer og underliggende virksomheter, for eksempel departementer og universiteter."
              error={errors.erArbeidsgiverenOffentligVirksomhet?.message}
              legend="Er arbeidsgiveren en offentlig virksomhet?"
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

        {erArbeidsgiverenOffentligVirksomhet === false && (
          <>
            <Controller
              control={control}
              name="erArbeidsgiverenBemanningsEllerVikarbyraa"
              render={({ field }) => (
                <RadioGroup
                  className="mt-4"
                  error={
                    errors.erArbeidsgiverenBemanningsEllerVikarbyraa?.message
                  }
                  legend="Er arbeidsgiveren et bemannings- eller vikarbyrå?"
                  onChange={(value) => field.onChange(value === "true")}
                  value={
                    field.value === undefined ? "" : field.value.toString()
                  }
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

            <Controller
              control={control}
              name="opprettholderArbeidsgivereVanligDrift"
              render={({ field }) => (
                <RadioGroup
                  className="mt-4"
                  description="Med dette mener vi at arbeidsgiveren fortsatt har aktivitet og ansatte som jobber i Norge i perioden."
                  error={errors.opprettholderArbeidsgivereVanligDrift?.message}
                  legend="Opprettholder arbeidsgiveren vanlig drift i Norge?"
                  onChange={(value) => field.onChange(value === "true")}
                  value={
                    field.value === undefined ? "" : field.value.toString()
                  }
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
          </>
        )}
      </SkjemaSteg>
    </form>
  );
}
