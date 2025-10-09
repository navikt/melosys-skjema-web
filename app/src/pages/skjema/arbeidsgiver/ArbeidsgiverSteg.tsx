import { zodResolver } from "@hookform/resolvers/zod";
import { FormSummary, TextField } from "@navikt/ds-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  getSkjemaAsArbeidsgiverQuery,
  registerArbeidsgiverInfo,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { ArbeidsgiversSkjemaDto } from "~/types/melosysSkjemaTypes.ts";
import { getValgtRolle } from "~/utils/sessionStorage.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsgiverSchema } from "./arbeidsgiverStegSchema.ts";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";

const stepKey = "arbeidsgiveren";

type ArbeidsgiverFormData = z.infer<typeof arbeidsgiverSchema>;

interface ArbeidsgiverStegContentProps {
  skjema: ArbeidsgiversSkjemaDto;
}

function ArbeidsgiverStegContent({ skjema }: ArbeidsgiverStegContentProps) {
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

  const registerArbeidsgiverMutation = useMutation({
    mutationFn: (data: ArbeidsgiverFormData) =>
      registerArbeidsgiverInfo(skjema.id, {
        organisasjonsnummer: data.organisasjonsnummer,
        organisasjonNavn: valgtRolle?.navn || "",
      }),
    onSuccess: () => {
      const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
      if (nextStep) {
        // TODO: lage noe felles utils eller noe cleanere enn nextStep.route.replace("$id", skjema.id);
        const nextRoute = nextStep.route.replace("$id", skjema.id);
        navigate({ to: nextRoute });
      }
    },
    onError: () => {
      toast.error("Kunne ikke lagre arbeidsgiverinfo. Prøv igjen.");
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

export function ArbeidsgiverSteg() {
  const { id } = useParams({ from: "/skjema/arbeidsgiver/$id/arbeidsgiveren" });

  const {
    data: skjema,
    isLoading,
    error,
  } = useQuery(getSkjemaAsArbeidsgiverQuery(id));

  if (isLoading) {
    return <div>Laster skjema...</div>;
  }

  if (error) {
    return <div>Feil ved lasting av skjema</div>;
  }

  if (!skjema) {
    return <div>Fant ikke skjema</div>;
  }

  return <ArbeidsgiverStegContent skjema={skjema} />;
}
