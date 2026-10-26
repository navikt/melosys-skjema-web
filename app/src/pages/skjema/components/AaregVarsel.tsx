import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { InfoCard } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

interface AaregVarselProperties {
  representasjonstype: Representasjonstype;
  className?: string;
}

/**
Ikke-blokkerende varsel når arbeidsforholdet ikke finnes i AAREG for hele utsendingsperioden
*/
export function AaregVarsel({ representasjonstype }: AaregVarselProperties) {
  const { t } = useTranslation();

  return (
    <InfoCard className="mt-4" data-color="warning">
      <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
        <InfoCard.Title>
          Arbeidsforhold er ikke registrert i Aa-registeret
        </InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        {t(
          representasjonstype === Representasjonstype.DEG_SELV
            ? "aaregVarsel.ingenArbeidsforholdDu"
            : "aaregVarsel.ingenArbeidsforhold",
        )}
      </InfoCard.Content>
    </InfoCard>
  );
}
