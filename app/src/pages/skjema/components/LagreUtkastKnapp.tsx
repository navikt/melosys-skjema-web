import { Button } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { useKontekst } from "~/hooks/useKontekst.ts";

export function LagreUtkastKnapp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const kontekst = useKontekst();

  return (
    <Button
      onClick={() => {
        if (kontekst) {
          void navigate({ to: "/oversikt", search: kontekst });
        }
      }}
      type="button"
      variant="tertiary"
    >
      {t("felles.lagreUtkastOgFortsettSenere")}
    </Button>
  );
}
