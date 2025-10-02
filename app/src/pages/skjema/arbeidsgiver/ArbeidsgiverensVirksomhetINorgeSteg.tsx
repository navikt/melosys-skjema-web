import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { getNextStep } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { arbeidsgiverensVirksomhetSchema } from "./arbeidsgiverensVirksomhetINorgeStegSchema.ts";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "arbeidsgiverens-virksomhet-i-norge";

type ArbeidsgiverensVirksomhetFormData = z.infer<
  typeof arbeidsgiverensVirksomhetSchema
>;

export function ArbeidsgiverensVirksomhetINorgeSteg() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
            },
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            description={t(
              "arbeidsgiverensVirksomhetINorgeSteg.offentligeVirksomheterErStatsorganerOgUnderliggendeVirksomheter",
            )}
            formFieldName="erArbeidsgiverenOffentligVirksomhet"
            legend={t(
              "arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEnOffentligVirksomhet",
            )}
          />

          {erArbeidsgiverenOffentligVirksomhet === false && (
            <>
              <RadioGroupJaNeiFormPart
                className="mt-4"
                formFieldName="erArbeidsgiverenBemanningsEllerVikarbyraa"
                legend={t(
                  "arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEtBemanningsEllerVikarbyra",
                )}
              />

              <RadioGroupJaNeiFormPart
                className="mt-4"
                description={t(
                  "arbeidsgiverensVirksomhetINorgeSteg.medDetteMenerViAtArbeidsgivereFortsattHarAktivitetOgAnsatteSomJobberINorgeIPerioden",
                )}
                formFieldName="opprettholderArbeidsgivereVanligDrift"
                legend={t(
                  "arbeidsgiverensVirksomhetINorgeSteg.opprettholderArbeidsgivereVanligDriftINorge",
                )}
              />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
