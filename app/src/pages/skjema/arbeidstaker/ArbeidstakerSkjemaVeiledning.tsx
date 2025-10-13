import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { createArbeidstakerSkjema } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import { SkjemaVeiledning } from "~/pages/skjema/components/SkjemaVeiledning.tsx";

export function ArbeidstakerSkjemaVeiledning() {
  const navigate = useNavigate();
  const { data: userInfo, isLoading, isError } = useQuery(getUserInfo());

  const createSkjemaMutation = useMutation({
    mutationFn: createArbeidstakerSkjema,
    onSuccess: (skjemaResponse) => {
      const firstStepRoute = ARBEIDSTAKER_STEG_REKKEFOLGE[0]?.route.replace(
        "$id",
        skjemaResponse.id,
      );
      navigate({ to: firstStepRoute });
    },
    onError: () => {
      toast.error("Kunne ikke opprette skjema. Prøv igjen.");
    },
  });

  const handleStartSoknad = () => {
    if (!userInfo?.userId) {
      toast.error("Mangler brukerinformasjon");
      return;
    }
    createSkjemaMutation.mutate({ fnr: userInfo.userId });
  };

  if (isLoading) return <div>Laster...</div>;
  if (isError) return <div>Feil ved henting av brukerinformasjon</div>;

  return <SkjemaVeiledning onStartSoknad={handleStartSoknad} />;
}
