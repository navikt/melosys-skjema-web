import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { InfoCard } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

interface AaregVarselProperties {
  representasjonstype: Representasjonstype;
  arbeidsgiverNavn: string;
  arbeidstakerNavn: string;
  className?: string;
}

/**
Ikke-blokkerende varsel når arbeidsforholdet ikke finnes i AAREG for hele utsendingsperioden
*/
export function AaregVarsel({
  representasjonstype,
  arbeidsgiverNavn,
  arbeidstakerNavn,
}: AaregVarselProperties) {
  const { t } = useTranslation();

  return (
    <InfoCard className="mt-4" data-color="warning" role="alert">
      <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
        <InfoCard.Title>{t("aaregVarsel.tittel")}</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        {t(
          representasjonstype === Representasjonstype.DEG_SELV
            ? "aaregVarsel.ingenArbeidsforholdDu"
            : "aaregVarsel.ingenArbeidsforhold",
          { arbeidsgiverNavn, arbeidstakerNavn },
        )}
      </InfoCard.Content>
    </InfoCard>
  );
}
