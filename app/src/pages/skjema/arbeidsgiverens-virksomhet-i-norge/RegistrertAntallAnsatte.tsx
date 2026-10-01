import { Alert } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { ANSATTGRENSE_SAMLET_VIRKSOMHET } from "./arbeidsgiverensVirksomhetINorgeStegSchema.ts";

interface RegistrertAntallAnsatteProperties {
  virksomhetsnavn: string;
  antallAnsatte: number;
}

export function RegistrertAntallAnsatte({
  virksomhetsnavn,
  antallAnsatte,
}: RegistrertAntallAnsatteProperties) {
  const { t } = useTranslation();
  const i18nKey =
    antallAnsatte < ANSATTGRENSE_SAMLET_VIRKSOMHET
      ? "arbeidsgiverensVirksomhetINorgeSteg.registrertMedFaerreEnnAnsatte"
      : "arbeidsgiverensVirksomhetINorgeSteg.registrertMedAnsatteEllerFlere";

  return (
    <Alert className="mt-8" variant="info">
      {t(i18nKey, {
        virksomhetsnavn,
        ansattgrense: ANSATTGRENSE_SAMLET_VIRKSOMHET,
      })}
    </Alert>
  );
}
