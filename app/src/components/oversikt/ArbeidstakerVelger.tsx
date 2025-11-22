import {
  Box,
  Button,
  Heading,
  HStack,
  TextField,
  UNSAFE_Combobox,
  VStack,
} from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

/**
 * Arbeidstaker-velger komponent med to modi:
 * 1. Med fullmakt: Combobox for valg fra liste av personer med fullmakt
 * 2. Uten fullmakt: Manuell input av fnr/d-nr og etternavn med verifisering
 *
 * TODO: MELOSYS-7726 vil implementere:
 * - State management for valgt arbeidstaker
 * - Lazy loading av personer med fullmakt
 * - Søk på navn og fødselsnummer
 * - PDL-verifisering for personer uten fullmakt
 * - Gjensidig ekskludering av de to valgene
 * - Visning av validert person
 */
export function ArbeidstakerVelger() {
  const { t } = useTranslation();

  return (
    <div>
      <Heading className="mt-4" level="3" size="small" spacing>
        {t("oversiktFelles.arbeidstakerTittel")}
      </Heading>

      <Box borderColor="border-info" borderWidth="0 0 0 4" paddingInline="4">
        <VStack gap="6">
          {/* Med fullmakt */}
          <div className="max-w-lg w-full">
            <UNSAFE_Combobox
              description={t(
                "oversiktFelles.arbeidstakerMedFullmaktPlaceholder",
              )}
              label={t("oversiktFelles.arbeidstakerMedFullmaktLabel")}
              options={[]}
            />
          </div>

          {/* Uten fullmakt */}
          <VStack gap="2">
            <Heading level="4" size="xsmall">
              {t("oversiktFelles.arbeidstakerUtenFullmaktTittel")}
            </Heading>
            <HStack align="end" gap="2" wrap={false}>
              <TextField label={t("oversiktFelles.arbeidstakerFnrLabel")} />
              <TextField
                label={t("oversiktFelles.arbeidstakerEtternavnLabel")}
              />
              <Button variant="secondary">
                {t("oversiktFelles.arbeidstakerSokKnapp")}
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </div>
  );
}
