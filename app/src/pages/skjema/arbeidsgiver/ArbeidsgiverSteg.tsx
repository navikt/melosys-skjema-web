import { zodResolver } from "@hookform/resolvers/zod";
import { FormSummary, TextField } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { getValgtRolle } from "~/utils/sessionStorage.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsgiverSchema } from "./arbeidsgiverStegSchema.ts";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "arbeidsgiveren";

type ArbeidsgiverFormData = z.infer<typeof arbeidsgiverSchema>;

export function ArbeidsgiverSteg() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const valgtRolle = getValgtRolle();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArbeidsgiverFormData>({
    resolver: zodResolver(arbeidsgiverSchema),
    defaultValues: {
      organisasjonsnummer: valgtRolle?.orgnr || "",
    },
  });

  const onSubmit = (data: ArbeidsgiverFormData) => {
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
    if (nextStep) {
      navigate({ to: nextStep.route });
    }
  };

  return (
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
        <TextField
          className="mt-4"
          error={translateError(errors.organisasjonsnummer?.message)}
          label={t("arbeidsgiverSteg.arbeidsgiverensOrganisasjonsnummer")}
          size="medium"
          style={{ maxWidth: "160px" }}
          {...register("organisasjonsnummer")}
          readOnly={valgtRolle?.orgnr !== undefined}
        />
        <FormSummary.Answer className="mt-4">
          <FormSummary.Label>
            {t("arbeidsgiverSteg.organisasjonensNavn")}
          </FormSummary.Label>
          <FormSummary.Value>{valgtRolle?.navn}</FormSummary.Value>
        </FormSummary.Answer>
      </SkjemaSteg>
    </form>
  );
}
