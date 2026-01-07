import { PaperplaneIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import {
  getInnsendtKvitteringQuery,
  sendInnSkjema,
} from "~/httpClients/melsosysSkjemaApiClient.ts";

interface SendInnSkjemaKnappProps {
  skjemaId: string;
}

export function SendInnSkjemaKnapp({ skjemaId }: SendInnSkjemaKnappProps) {
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

      navigate({
        to: "/skjema/$id/kvittering",
        params: { id: response.skjemaId },
      });
    },
    onError: () => {
      toast.error(t("felles.feil"));
    },
  });

  const handleClick = () => {
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
