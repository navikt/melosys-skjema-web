import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  VStack,
} from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import type {
  Organisasjon,
  RepresentasjonskontekstDto,
} from "~/types/representasjon";

import { ArbeidsgiverVelger } from "./ArbeidsgiverVelger";
import { ArbeidstakerVelger } from "./ArbeidstakerVelger";

interface SoknadStarterProps {
  kontekst: RepresentasjonskontekstDto;
  onArbeidsgiverValgt: (organisasjon: Organisasjon) => void;
}

/**
 * Søknadsstarter-komponent som lar brukeren velge arbeidsgiver og arbeidstaker
 * før søknad startes.
 *
 * TODO: MELOSYS-7727 vil implementere:
 * - Validering av at både arbeidsgiver og arbeidstaker er valgt
 * - Navigering til søknadsskjema med kontekst
 * - Oppsummering av valgt kontekst
 */
export function SoknadStarter({
  kontekst,
  onArbeidsgiverValgt,
}: SoknadStarterProps) {
  const { t } = useTranslation();

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
          onArbeidsgiverValgt={onArbeidsgiverValgt}
        />

        {kontekst.type !== "DEG_SELV" && <ArbeidstakerVelger />}

        <Button className="w-fit" variant="primary">
          {t("oversiktFelles.gaTilSkjemaKnapp")}
        </Button>
      </VStack>
    </Box>
  );
}
