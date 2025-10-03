import { zodResolver } from "@hookform/resolvers/zod";
import { GuidePanel } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";

import { familiemedlemmerSchema } from "./familiemedlemmerStegSchema.ts";

const stepKey = "familiemedlemmer";

export function FamiliemedlemmerSteg() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  type FamiliemedlemmerFormData = z.infer<typeof familiemedlemmerSchema>;

  const formMethods = useForm<FamiliemedlemmerFormData>({
    resolver: zodResolver(familiemedlemmerSchema),
  });

  const { handleSubmit, watch } = formMethods;
  const sokerForBarnUnder18SomSkalVaereMed = watch(
    "sokerForBarnUnder18SomSkalVaereMed",
  );
  const harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad = watch(
    "harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad",
  );

  const onSubmit = (data: FamiliemedlemmerFormData) => {
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
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
            },
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="sokerForBarnUnder18SomSkalVaereMed"
            legend={t(
              "familiemedlemmerSteg.sokerDuForBarnUnder18SomSkalVaereMed",
            )}
          />

          {sokerForBarnUnder18SomSkalVaereMed && (
            <GuidePanel className="mt-4">
              {t("familiemedlemmerSteg.duMaLageEgenSoknadForBarna")}
            </GuidePanel>
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad"
            legend={t(
              "familiemedlemmerSteg.harDuEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad",
            )}
          />

          {harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad && (
            <GuidePanel className="mt-4">
              {t(
                "familiemedlemmerSteg.duMaLageEgenSoknadForEktefellePartnerSamboerEllerBarnOver18",
              )}
            </GuidePanel>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
