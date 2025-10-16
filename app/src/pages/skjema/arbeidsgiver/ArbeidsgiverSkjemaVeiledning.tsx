import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { createArbeidsgiverSkjema } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidsgiver/stegRekkefølge.ts";
import { SkjemaVeiledning } from "~/pages/skjema/components/SkjemaVeiledning.tsx";
import { getValgtRolle } from "~/utils/sessionStorage.ts";

export function ArbeidsgiverSkjemaVeiledning() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const valgtRolle = getValgtRolle();

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
      toast.error(t("felles.kunneIkkeOppretteSkjema"));
    },
  });

  const handleStartSoknad = () => {
    if (!valgtRolle?.orgnr) {
      toast.error(t("felles.manglerOrganisasjonsnummer"));
      return;
    }

    createSkjemaMutation.mutate({ orgnr: valgtRolle.orgnr });
  };

  return <SkjemaVeiledning onStartSoknad={handleStartSoknad} />;
}
