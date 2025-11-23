import { XMarkIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Label,
  TextField,
  UNSAFE_Combobox,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getPersonerMedFullmaktQuery,
  type PersonMedFullmaktDto,
  verifiserPerson,
} from "~/httpClients/melsosysSkjemaApiClient";
import type { Person } from "~/types/representasjon";

/**
 * Formaterer ISO dato (yyyy-mm-dd) til norsk format (dd.mm.yyyy)
 */
function formaterDato(isoDato: string): string {
  const [year, month, day] = isoDato.split("-");
  return `${day}.${month}.${year}`;
}

interface ArbeidstakerVelgerProps {
  onArbeidstakerValgt?: (arbeidstaker?: Person | undefined) => void;
  valgtArbeidstaker?: Person;
}

interface VerifisertPerson {
  fnr: string;
  etternavn: string;
  navn: string;
  fodselsdato: string;
}

/**
 * Arbeidstaker-velger komponent med to valg:
 * 1. Med fullmakt: Combobox for valg fra liste av personer med fullmakt
 * 2. Uten fullmakt: Manuell input av fnr/d-nr og etternavn med verifisering
 *
 */
export function ArbeidstakerVelger({
  onArbeidstakerValgt,
}: ArbeidstakerVelgerProps) {
  const { t } = useTranslation();
  const [fnr, setFnr] = useState("");
  const [etternavn, setEtternavn] = useState("");
  const [verifisertPerson, setVerifisertPerson] = useState<
    VerifisertPerson | undefined
  >();
  const [verifiseringFeil, setVerifiseringFeil] = useState<string | null>(null);
  const [verifiserer, setVerifiserer] = useState(false);
  const [selectedPersonFnr, setSelectedPersonFnr] = useState<
    string | undefined
  >();
  const [medFullmaktHarFokus, setMedFullmaktHarFokus] = useState(false);
  const [utenFullmaktHarFokus, setUtenFullmaktHarFokus] = useState(false);

  // Lazy loading av personer med fullmakt
  const {
    data: personerMedFullmakt = [],
    isLoading,
    error,
  } = useQuery(getPersonerMedFullmaktQuery());

  // Konverter til combobox options med fødselsnummer
  const comboboxOptions = personerMedFullmakt.map(
    (person: PersonMedFullmaktDto) => ({
      label: `${person.navn} - ${person.fnr}`,
      value: person.fnr,
    }),
  );

  const harValgtMedFullmakt = selectedPersonFnr !== undefined;
  const harValgtUtenFullmakt = verifisertPerson !== undefined;
  const skalDisableMedFullmakt = harValgtUtenFullmakt || utenFullmaktHarFokus;
  const skalDisableUtenFullmakt = harValgtMedFullmakt || medFullmaktHarFokus;

  const handleComboboxChange = (value: string) => {
    const person = personerMedFullmakt.find((p) => p.fnr === value);

    if (person) {
      setSelectedPersonFnr(person.fnr);
      if (onArbeidstakerValgt) {
        onArbeidstakerValgt({
          fnr: person.fnr,
          navn: person.navn,
          fodselsdato: person.fodselsdato,
        });
      }
    }
  };

  const handleClearMedFullmakt = () => {
    setSelectedPersonFnr(undefined);
    setMedFullmaktHarFokus(false);
    onArbeidstakerValgt?.();
  };

  const handleVerifiser = async () => {
    setVerifiseringFeil(null);
    setVerifiserer(true);

    try {
      const response = await verifiserPerson({
        fodselsnummer: fnr,
        etternavn,
      });

      // Success response means person is verified
      const formatertDato = formaterDato(response.fodselsdato);
      setVerifisertPerson({
        fnr,
        etternavn,
        navn: response.navn,
        fodselsdato: formatertDato,
      });
      setVerifiseringFeil(null);

      if (onArbeidstakerValgt) {
        onArbeidstakerValgt({
          fnr,
          navn: response.navn,
          fodselsdato: response.fodselsdato, // Send original ISO format to parent
        });
      }
    } catch (error: unknown) {
      setVerifisertPerson(undefined);

      // Sjekk status code for å vise riktig feilmelding
      if (error instanceof Error && "status" in error) {
        const statusError = error as { status?: number };
        if (statusError.status === 429) {
          setVerifiseringFeil(t("velgRadgiverfirma.rateLimitOverskredet"));
        } else {
          setVerifiseringFeil(
            t("oversiktFelles.arbeidstakerVerifiseringFeilet"),
          );
        }
      } else {
        // Fallback hvis vi ikke kan lese status
        setVerifiseringFeil(t("oversiktFelles.arbeidstakerVerifiseringFeilet"));
      }
    } finally {
      setVerifiserer(false);
    }
  };

  const handleFjernVerifisertPerson = () => {
    setVerifisertPerson(undefined);
    setFnr("");
    setEtternavn("");
    setVerifiseringFeil(null);
    setUtenFullmaktHarFokus(false);
    onArbeidstakerValgt?.();
  };

  const kanVerifisere = fnr.length === 11 && etternavn.length >= 2;

  return (
    <div>
      <Heading className="mt-4" level="3" size="small" spacing>
        {t("oversiktFelles.arbeidstakerTittel")}
      </Heading>

      <Box borderColor="border-info" borderWidth="0 0 0 4" paddingInline="4">
        <VStack gap="6">
          {/* Med fullmakt */}
          <div className="max-w-lg w-full">
            {harValgtMedFullmakt ? (
              <Box
                background="surface-default"
                borderColor="border-subtle"
                borderRadius="small"
                borderWidth="1"
                padding="2"
              >
                <HStack align="center" justify="space-between">
                  <BodyShort>
                    {
                      personerMedFullmakt.find(
                        (p) => p.fnr === selectedPersonFnr,
                      )?.navn
                    }{" "}
                    - {selectedPersonFnr}
                  </BodyShort>
                  <Button
                    icon={<XMarkIcon aria-hidden />}
                    onClick={handleClearMedFullmakt}
                    size="small"
                    variant="tertiary"
                  />
                </HStack>
              </Box>
            ) : (
              <UNSAFE_Combobox
                description={t(
                  "oversiktFelles.arbeidstakerMedFullmaktBeskrivelse",
                )}
                disabled={skalDisableMedFullmakt}
                error={
                  error ? "Kunne ikke laste personer med fullmakt" : undefined
                }
                isLoading={isLoading}
                label={t("oversiktFelles.arbeidstakerMedFullmaktLabel")}
                onBlur={() => setMedFullmaktHarFokus(false)}
                onFocus={() => setMedFullmaktHarFokus(true)}
                onToggleSelected={handleComboboxChange}
                options={comboboxOptions}
                placeholder={t(
                  "oversiktFelles.arbeidstakerMedFullmaktPlaceholder",
                )}
                shouldAutocomplete
              />
            )}
          </div>

          {/* Uten fullmakt */}
          <div
            className="navds-form-field navds-form-field--medium"
            style={{
              opacity: skalDisableUtenFullmakt ? 0.5 : 1,
            }}
          >
            <Label className="navds-form-field__label">
              {t("oversiktFelles.arbeidstakerUtenFullmaktTittel")}
            </Label>
            <BodyShort className="navds-form-field__description">
              {t("oversiktFelles.arbeidstakerUtenFullmaktBeskrivelse")}
            </BodyShort>

            {verifisertPerson ? (
              <Box
                background="surface-default"
                borderColor="border-subtle"
                borderRadius="small"
                borderWidth="1"
                className="max-w-lg"
                padding="2"
              >
                <HStack align="center" justify="space-between">
                  <BodyShort>
                    {verifisertPerson.navn} - {verifisertPerson.fnr}
                  </BodyShort>
                  <Button
                    icon={<XMarkIcon aria-hidden />}
                    onClick={handleFjernVerifisertPerson}
                    size="small"
                    variant="tertiary"
                  />
                </HStack>
              </Box>
            ) : (
              <>
                <HStack align="end" gap="2" wrap={false}>
                  <TextField
                    disabled={skalDisableUtenFullmakt}
                    label={t("oversiktFelles.arbeidstakerFnrLabel")}
                    maxLength={11}
                    onBlur={() => setUtenFullmaktHarFokus(false)}
                    onChange={(e) => setFnr(e.target.value)}
                    onFocus={() => setUtenFullmaktHarFokus(true)}
                    value={fnr}
                  />
                  <TextField
                    disabled={skalDisableUtenFullmakt}
                    label={t("oversiktFelles.arbeidstakerEtternavnLabel")}
                    onBlur={() => setUtenFullmaktHarFokus(false)}
                    onChange={(e) => setEtternavn(e.target.value)}
                    onFocus={() => setUtenFullmaktHarFokus(true)}
                    value={etternavn}
                  />
                  <Button
                    disabled={!kanVerifisere || skalDisableUtenFullmakt}
                    loading={verifiserer}
                    onClick={handleVerifiser}
                    variant="secondary"
                  >
                    {t("oversiktFelles.arbeidstakerSokKnapp")}
                  </Button>
                </HStack>

                {verifiseringFeil && (
                  <Alert size="small" variant="error">
                    {verifiseringFeil}
                  </Alert>
                )}
              </>
            )}
          </div>
        </VStack>
      </Box>
    </div>
  );
}
