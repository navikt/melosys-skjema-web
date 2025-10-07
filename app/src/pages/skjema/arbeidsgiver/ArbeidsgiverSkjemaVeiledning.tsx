import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { createArbeidsgiverSkjema } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidsgiver/stegRekkefølge.ts";
import { SkjemaVeiledning } from "~/pages/skjema/components/SkjemaVeiledning.tsx";

export function ArbeidsgiverSkjemaVeiledning() {
  const navigate = useNavigate();

  const createSkjemaMutation = useMutation({
    mutationFn: createArbeidsgiverSkjema,
    onSuccess: (skjemaResponse) => {
      // Navigate to first step with the actual skjema ID
      const firstStepRoute = ARBEIDSGIVER_STEG_REKKEFOLGE[0]?.route.replace(
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
    // You'll need to get the organization number from somewhere
    // For now, using a placeholder - you might get this from user context/selection
    const orgnr = "123456789"; // TODO: Get actual org number

    createSkjemaMutation.mutate({ orgnr });
  };

  return <SkjemaVeiledning onStartSoknad={handleStartSoknad} />;
}
