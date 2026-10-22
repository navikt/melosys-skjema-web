import { Alert } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

interface AaregVarselProperties {
  representasjonstype: Representasjonstype;
  className?: string;
}

/**
Ikke-blokkerende varsel når arbeidsforholdet ikke finnes i AAREG for hele utsendingsperioden
*/
export function AaregVarsel({
  representasjonstype,
  className,
}: AaregVarselProperties) {
  const { t } = useTranslation();

  return (
    <Alert className={className} size="small" variant="warning">
      {t(
        representasjonstype === Representasjonstype.DEG_SELV
          ? "aaregVarsel.ingenArbeidsforholdDu"
          : "aaregVarsel.ingenArbeidsforhold",
      )}
    </Alert>
  );
}
