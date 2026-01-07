import { PaperplaneIcon } from "@navikt/aksel-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import {
  getInnsendtKvitteringQuery,
  sendInnSkjema,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { TilleggsopplysningerStegOppsummering } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegOppsummering.tsx";

import { stepKey as arbeidssituasjonStepKey } from "../arbeidssituasjon/ArbeidssituasjonSteg.tsx";
import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { stepKey as familiemedlemmerStepKey } from "../familiemedlemmer/FamiliemedlemmerSteg.tsx";
import { stepKey as skatteforholdOgInntektStepKey } from "../skatteforhold-og-inntekt/SkatteforholdOgInntektSteg.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { stepKey as tilleggsopplysningerStepKey } from "../tilleggsopplysninger/TilleggsopplysningerSteg.tsx";
import { ArbeidstakerSkjemaProps } from "../types.ts";
import { stepKey as utenlandsoppdragetStepKey } from "../utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";
import { ArbeidssituasjonStegOppsummering } from "./ArbeidssituasjonStegOppsummering.tsx";
import { FamiliemedlemmerStegOppsummering } from "./FamiliemedlemmerStegOppsummering.tsx";
import { SkatteforholdOgInntektStegOppsummering } from "./SkatteforholdOgInntektStegOppsummering.tsx";
import { UtenlandsoppdragetStegOppsummering } from "./UtenlandsoppdragetStegOppsummering.tsx";

const oppsummeringStepKey = "oppsummering";

interface ArbeidstakerOppsummeringStegProps {
  id: string;
}

export function ArbeidstakerOppsummeringSteg({
  id,
}: ArbeidstakerOppsummeringStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <ArbeidstakerOppsummeringStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}

function ArbeidstakerOppsummeringStegContent({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleSubmit } = useForm();

  const sendInnSkjemaMutation = useMutation({
    mutationFn: () => sendInnSkjema(skjema.id),
    onSuccess: (response) => {
      // Populer cache for kvittering-query
      queryClient.setQueryData(
        getInnsendtKvitteringQuery(response.skjemaId).queryKey,
        response,
      );

      navigate({
        to: "/skjema/kvittering/$id",
        params: { id: response.skjemaId },
      });
    },
    onError: () => {
      toast.error(t("felles.feil"));
    },
  });

  const renderStepSummary = (stepKey: string) => {
    switch (stepKey) {
      case arbeidssituasjonStepKey: {
        return (
          <ArbeidssituasjonStegOppsummering key={stepKey} skjema={skjema} />
        );
      }
      case utenlandsoppdragetStepKey: {
        return (
          <UtenlandsoppdragetStegOppsummering key={stepKey} skjema={skjema} />
        );
      }
      case skatteforholdOgInntektStepKey: {
        return (
          <SkatteforholdOgInntektStegOppsummering
            key={stepKey}
            skjema={skjema}
          />
        );
      }
      case familiemedlemmerStepKey: {
        return (
          <FamiliemedlemmerStegOppsummering key={stepKey} skjema={skjema} />
        );
      }
      case tilleggsopplysningerStepKey: {
        return (
          <TilleggsopplysningerStegOppsummering
            key={stepKey}
            skjema={skjema}
            stegRekkefolge={ARBEIDSTAKER_STEG_REKKEFOLGE}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  const onSubmit = () => {
    sendInnSkjemaMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SkjemaSteg
        config={{
          stepKey: oppsummeringStepKey,
          stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          customNesteKnapp: {
            tekst: t("felles.sendSoknad"),
            ikon: <PaperplaneIcon />,
            type: "submit",
            loading: sendInnSkjemaMutation.isPending,
          },
        }}
      >
        {ARBEIDSTAKER_STEG_REKKEFOLGE.filter(
          (steg) => steg.key !== oppsummeringStepKey,
        ).map((steg) => renderStepSummary(steg.key))}
      </SkjemaSteg>
    </form>
  );
}
