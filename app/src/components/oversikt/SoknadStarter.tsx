import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  VStack,
} from "@navikt/ds-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type {
  Organisasjon,
  RepresentasjonskontekstDto,
} from "~/types/representasjon";

import { ArbeidsgiverVelger } from "./ArbeidsgiverVelger";
import { ArbeidstakerVelger } from "./ArbeidstakerVelger";

interface SoknadStarterProps {
  kontekst: RepresentasjonskontekstDto;
}

/**
 * Søknadsstarter-komponent som lar brukeren velge arbeidsgiver og arbeidstaker
 * før søknad startes.
 *
 * TODO: MELOSYS-7727 vil implementere:
 * - Validering av at både arbeidsgiver og arbeidstaker er valgt
 * - Form submission med valgt arbeidsgiver og arbeidstaker
 * - Navigering til søknadsskjema med kontekst
 * - Oppsummering av valgt kontekst
 */
export function SoknadStarter({ kontekst }: SoknadStarterProps) {
  const { t } = useTranslation();
  const [valgtArbeidsgiver, setValgtArbeidsgiver] = useState<
    Organisasjon | undefined
  >(kontekst.arbeidsgiver);

  const handleSubmit = () => {
    // TODO: MELOSYS-7727 - Implementer validering og navigering til skjema
    // Med valgtArbeidsgiver og valgtArbeidstaker
    // eslint-disable-next-line no-console -- Fjernes i MELOSYS-7727
    console.log("Valgt arbeidsgiver:", valgtArbeidsgiver);
  };

  return (
    <Box
      background="surface-info-subtle"
      borderColor="border-subtle"
      borderRadius="small"
      borderWidth="1"
      className="surface-action-subtle"
      padding="6"
    >
      <VStack gap="6">
        <div>
          <Heading level="2" size="medium" spacing>
            {t("oversiktFelles.soknadStarterTittel")}
          </Heading>
          <BodyLong spacing>
            {kontekst.type === "DEG_SELV"
              ? t("oversiktFelles.soknadStarterInfoDegSelv")
              : t("oversiktFelles.soknadStarterInfo")}
          </BodyLong>
          {kontekst.type !== "DEG_SELV" && (
            <VStack gap="4">
              <BodyShort>
                {t("oversiktFelles.soknadStarterFullmaktInfo1")}
              </BodyShort>
              <BodyShort>
                {t("oversiktFelles.soknadStarterFullmaktInfo2")}
              </BodyShort>
              <BodyShort>
                {t("oversiktFelles.soknadStarterFullmaktInfo3")}
              </BodyShort>
            </VStack>
          )}
        </div>

        <ArbeidsgiverVelger
          kontekst={kontekst}
          onArbeidsgiverValgt={setValgtArbeidsgiver}
          valgtArbeidsgiver={valgtArbeidsgiver}
        />

        {kontekst.type !== "DEG_SELV" && <ArbeidstakerVelger />}

        <Button className="w-fit" onClick={handleSubmit} variant="primary">
          {t("oversiktFelles.gaTilSkjemaKnapp")}
        </Button>
      </VStack>
    </Box>
  );
}
