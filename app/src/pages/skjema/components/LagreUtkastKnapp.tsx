import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Representasjonskontekst } from "~/types/representasjon.ts";

interface LagreUtkastKnappProps {
  representasjonskontekst: Representasjonskontekst;
}

export function LagreUtkastKnapp({
  representasjonskontekst,
}: LagreUtkastKnappProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        type="button"
        variant="tertiary"
      >
        {t("felles.lagreUtkastOgFortsettSenere")}
      </Button>

      <Modal
        header={{
          heading: t("felles.lagreUtkastOgFortsettSenere") + "?",
        }}
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        width="medium"
      >
        <Modal.Body>
          <BodyLong>{t("felles.lagreUtkastBeskrivelse")}</BodyLong>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              void queryClient.invalidateQueries({ queryKey: ["utkast"] });
              void navigate({
                to: "/oversikt",
                search: representasjonskontekst,
              });
            }}
            type="button"
          >
            {t("felles.jaLagreOgFortsettSenere")}
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
