import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { slettUtkast } from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";

interface AvbrytOgSlettKnappProps {
  representasjonskontekst: Representasjonskontekst;
  skjemaId: string;
}

export function AvbrytOgSlettKnapp({
  representasjonskontekst,
  skjemaId,
}: AvbrytOgSlettKnappProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const slettUtkastMutation = useMutation({
    mutationFn: () => slettUtkast(skjemaId),
    onSuccess: () => {
      void navigate({ to: "/oversikt", search: representasjonskontekst });
    },
    onError: () => {
      toast.error(t("felles.feil"));
    },
  });

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        type="button"
        variant="tertiary"
      >
        {t("felles.avbrytOgSlett")}
      </Button>

      <Modal
        header={{
          heading: t("felles.avbrytOgSlettUtkast"),
        }}
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        width="medium"
      >
        <Modal.Body>
          <BodyLong>{t("felles.alleOpplysningerVilBliSlettet")}</BodyLong>
        </Modal.Body>
        <Modal.Footer>
          <Button
            loading={slettUtkastMutation.isPending}
            onClick={() => slettUtkastMutation.mutate()}
            type="button"
            variant="danger"
          >
            {t("felles.jaAvbrytOgSlettUtkast")}
          </Button>
          <Button
            onClick={() => setIsModalOpen(false)}
            type="button"
            variant="secondary"
          >
            {t("felles.neiFortsettUtfylling")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
