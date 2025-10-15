import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { createArbeidstakerSkjema } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import { SkjemaVeiledning } from "~/pages/skjema/components/SkjemaVeiledning.tsx";

export function ArbeidstakerSkjemaVeiledning() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: userInfo, isLoading, isError } = useQuery(getUserInfo());

  const createSkjemaMutation = useMutation({
    mutationFn: createArbeidstakerSkjema,
    onSuccess: (skjemaResponse) => {
      const firstStep = ARBEIDSTAKER_STEG_REKKEFOLGE[0];
      if (firstStep) {
        navigate({
          to: firstStep.route,
          params: { id: skjemaResponse.id },
        });
      }
    },
    onError: () => {
      toast.error(t("felles.feil"));
    },
  });

  const handleStartSoknad = () => {
    if (!userInfo?.userId) {
      toast.error(t("felles.brukerinfoMangler"));
      return;
    }
    createSkjemaMutation.mutate({ fnr: userInfo.userId });
  };

  if (isLoading) return <div>Laster...</div>;
  if (isError) return <div>Feil ved henting av brukerinformasjon</div>;

  return <SkjemaVeiledning onStartSoknad={handleStartSoknad} />;
}
