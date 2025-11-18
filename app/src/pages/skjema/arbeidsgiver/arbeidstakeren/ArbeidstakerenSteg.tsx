import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useInvalidateArbeidsgiversSkjemaQuery } from "~/hooks/useInvalidateArbeidsgiversSkjemaQuery.ts";
import { postArbeidstakeren } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";
import { arbeidstakerenSchema } from "./arbeidstakerenStegSchema.ts";

export const stepKey = "arbeidstakeren";

type ArbeidstakerenFormData = z.infer<typeof arbeidstakerenSchema>;

function ArbeidstakerenStegContent({ skjema }: ArbeidsgiverSkjemaProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const invalidateArbeidsgiverSkjemaQuery =
    useInvalidateArbeidsgiversSkjemaQuery();

  const lagretSkjemadataForSteg = skjema.data?.arbeidstakeren;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArbeidstakerenFormData>({
    resolver: zodResolver(arbeidstakerenSchema),
    defaultValues: {
      fodselsnummer: lagretSkjemadataForSteg?.fodselsnummer || "",
    },
  });

  const registerArbeidstakerMutation = useMutation({
    mutationFn: (data: ArbeidstakerenFormData) =>
      postArbeidstakeren(skjema.id, {
        fodselsnummer: data.fodselsnummer,
      }),
    onSuccess: async () => {
      await invalidateArbeidsgiverSkjemaQuery(skjema.id);
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

  const onSubmit = (data: ArbeidstakerenFormData) => {
    registerArbeidstakerMutation.mutate(data);
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
            loading: registerArbeidstakerMutation.isPending,
          },
        }}
      >
        <TextField
          className="mt-4"
          error={translateError(errors.fodselsnummer?.message)}
          label={t(
            "arbeidstakerenSteg.harArbeidstakerenNorskFodselsnummerEllerDNummer",
          )}
          size="medium"
          style={{ maxWidth: "160px" }}
          {...register("fodselsnummer")}
        />
      </SkjemaSteg>
    </form>
  );
}

interface ArbeidstakerenStegProps {
  id: string;
}

export function ArbeidstakerenSteg({ id }: ArbeidstakerenStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <ArbeidstakerenStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}
