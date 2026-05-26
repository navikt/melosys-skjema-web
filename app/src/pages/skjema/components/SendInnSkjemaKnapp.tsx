import { PaperplaneIcon } from "@navikt/aksel-icons";
import { Alert, Button } from "@navikt/ds-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  getInnsendtKvitteringQuery,
  getSkjemaQuery,
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

      void queryClient.invalidateQueries({
        queryKey: getSkjemaQuery(response.skjemaId).queryKey,
      });

      void queryClient.invalidateQueries({
        queryKey: ["innsendte-soknader"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["utkast"],
      });

      navigate({
        to: "/skjema/$id/kvittering",
        params: { id: response.skjemaId },
      });
    },
  });

  const handleClick = () => {
    sendInnSkjemaMutation.mutate();
  };

  return (
    <>
      {sendInnSkjemaMutation.isError && (
        <Alert className="mb-4" role="alert" size="small" variant="error">
          {t("felles.feil")}
        </Alert>
      )}
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
    </>
  );
}
