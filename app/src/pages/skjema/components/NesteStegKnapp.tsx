import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

interface NesteStegKnappProperties {
  loading?: boolean;
}

export function NesteStegKnapp({ loading }: NesteStegKnappProperties) {
  const { t } = useTranslation();

  return (
    <Button
      icon={<ArrowRightIcon />}
      iconPosition="right"
      loading={loading}
      type="submit"
      variant="primary"
    >
      {t("felles.lagreOgFortsett")}
    </Button>
  );
}
