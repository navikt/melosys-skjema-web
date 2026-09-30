import { Alert, Lookup } from "@navikt/ds-react";
import { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";

interface RegistrertSomOffentligVirksomhetProperties {
  virksomhetsnavn: string;
}

export function RegistrertSomOffentligVirksomhet({
  virksomhetsnavn,
}: RegistrertSomOffentligVirksomhetProperties) {
  return (
    <Alert className="mt-8" variant="info">
      <Trans
        components={{ lookup: <OffentligVirksomhetLookup /> }}
        i18nKey="utenlandsoppdragetSteg.registrertSomOffentligVirksomhet"
        values={{ virksomhetsnavn }}
      />
    </Alert>
  );
}

// Trans legger ordet fra <lookup>…</lookup> i oversettelsen inn som children
function OffentligVirksomhetLookup({ children }: { children?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <Lookup word={String(children ?? "")}>
      {t("utenlandsoppdragetSteg.offentligVirksomhetForklaring")}
    </Lookup>
  );
}
