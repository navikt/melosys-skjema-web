import { zodResolver } from "@hookform/resolvers/zod";
import { FormSummary, TextField } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useInvalidateArbeidsgiversSkjemaQuery } from "~/hooks/useInvalidateArbeidsgiversSkjemaQuery.ts";
import { postArbeidsgiveren } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { getValgtRolle } from "~/utils/sessionStorage.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsgiverSchema } from "./arbeidsgiverStegSchema.ts";
import { ArbeidsgiverStegLoader } from "./components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "./types.ts";

export const stepKey = "arbeidsgiveren";

type ArbeidsgiverFormData = z.infer<typeof arbeidsgiverSchema>;

function ArbeidsgiverStegContent({ skjema }: ArbeidsgiverSkjemaProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidsgiverSkjemaQuery =
    useInvalidateArbeidsgiversSkjemaQuery();

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

  const registerArbeidsgiverMutation = useMutation({
    mutationFn: (data: ArbeidsgiverFormData) =>
      postArbeidsgiveren(skjema.id, {
        organisasjonsnummer: data.organisasjonsnummer,
        organisasjonNavn: valgtRolle?.navn || "",
      }),
    onSuccess: () => {
      invalidateArbeidsgiverSkjemaQuery(skjema.id);
      const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjema.id },
        });
      }
    },
    onError: () => {
      toast.error(t("felles.feil"));
    },
  });

  const onSubmit = (data: ArbeidsgiverFormData) => {
    registerArbeidsgiverMutation.mutate(data);
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
            loading: registerArbeidsgiverMutation.isPending,
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

interface ArbeidsgiverStegProps {
  id: string;
}

export function ArbeidsgiverSteg({ id }: ArbeidsgiverStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <ArbeidsgiverStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}
