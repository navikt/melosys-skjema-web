import { PaperplaneIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  getInnsendtKvitteringQuery,
  getSkjemaQuery,
  sendInnSkjema,
  VENTENDE_MOTPART_SOKNADER_QUERY_KEY,
} from "~/httpClients/melsosysSkjemaApiClient.ts";

interface SendInnSkjemaKnappProperties {
  skjemaId: string;
  onBeforeSubmit: () => boolean;
  onSubmitError: () => void;
}

export function SendInnSkjemaKnapp({
  skjemaId,
  onBeforeSubmit,
  onSubmitError,
}: SendInnSkjemaKnappProperties) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const sendInnSkjemaMutation = useMutation({
    mutationFn: () => sendInnSkjema(skjemaId),
    onSuccess: (response) => {
      // Populer cache for kvittering-query
      queryClient.setQueryData(
        getInnsendtKvitteringQuery(response.skjemaId).queryKey,
        response,
      );

      void queryClient.invalidateQueries({
        queryKey: getSkjemaQuery(response.skjemaId).queryKey,
      });

      void queryClient.invalidateQueries({
        queryKey: ["innsendte-soknader"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["utkast"],
      });

      void queryClient.invalidateQueries({
        queryKey: VENTENDE_MOTPART_SOKNADER_QUERY_KEY,
      });

      navigate({
        to: "/skjema/$id/kvittering",
        params: { id: response.skjemaId },
      });
    },
    onError: () => {
      onSubmitError();
    },
  });

  const handleClick = () => {
    if (!onBeforeSubmit()) {
      return;
    }

    sendInnSkjemaMutation.mutate();
  };

  return (
    <Button
      icon={<PaperplaneIcon />}
      iconPosition="right"
      loading={sendInnSkjemaMutation.isPending}
      onClick={handleClick}
      type="button"
      variant="primary"
    >
      {t("felles.sendSoknad")}
    </Button>
  );
}
