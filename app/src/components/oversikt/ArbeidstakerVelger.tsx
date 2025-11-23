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
import { z } from "zod";

import {
  getPersonerMedFullmaktQuery,
  type PersonMedFullmaktDto,
  verifiserPerson,
} from "~/httpClients/melsosysSkjemaApiClient";
import type { Person } from "~/types/representasjon";

const FNR_LENGTH = 11;

interface ArbeidstakerVelgerProps {
  onArbeidstakerValgt?: (
    arbeidstaker?: Person | undefined,
    harFullmakt?: boolean,
  ) => void;
  harFeil?: boolean;
  visKunMedFullmakt?: boolean;
}

interface VerifisertPerson {
  fnr: string;
  etternavn: string;
  navn: string;
}

// Zod schema for validering av arbeidstaker uten fullmakt
const arbeidstakerSchema = z.object({
  fnr: z
    .string()
    .refine((val) => val.length === FNR_LENGTH && /^\d+$/.test(val), {
      message: "oversiktFelles.arbeidstakerFnrUgyldig",
    }),
  etternavn: z.string().refine((val) => val.trim().length > 0, {
    message: "oversiktFelles.arbeidstakerEtternavnTom",
  }),
});

/**
 * Arbeidstaker-velger komponent med to valg:
 * 1. Med fullmakt: Combobox for valg fra liste av personer med fullmakt
 * 2. Uten fullmakt: Manuell input av fnr/d-nr og etternavn med verifisering
 *
 * @param visKunMedFullmakt - Hvis true, skjuler "uten fullmakt" seksjonen (brukes for ANNEN_PERSON)
 */
export function ArbeidstakerVelger({
  onArbeidstakerValgt,
  harFeil = false,
  visKunMedFullmakt = false,
}: ArbeidstakerVelgerProps) {
  const { t } = useTranslation();
  const [fnr, setFnr] = useState("");
  const [etternavn, setEtternavn] = useState("");
  const [fnrError, setFnrError] = useState<string | null>(null);
  const [etternavnError, setEtternavnError] = useState<string | null>(null);
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
  const skalDisableMedFullmakt =
    !visKunMedFullmakt && (harValgtUtenFullmakt || utenFullmaktHarFokus);
  const skalDisableUtenFullmakt = harValgtMedFullmakt || medFullmaktHarFokus;

  const handleComboboxChange = (value: string) => {
    const person = personerMedFullmakt.find((p) => p.fnr === value);

    if (person) {
      setSelectedPersonFnr(person.fnr);
      // Clear validation errors from "uten fullmakt" section
      setFnrError(null);
      setEtternavnError(null);
      if (onArbeidstakerValgt) {
        onArbeidstakerValgt(
          {
            fnr: person.fnr,
            navn: person.navn,
            fodselsdato: person.fodselsdato,
          },
          true,
        ); // Med fullmakt
      }
    }
  };

  const handleClearMedFullmakt = () => {
    setSelectedPersonFnr(undefined);
    setMedFullmaktHarFokus(false);
    onArbeidstakerValgt?.(undefined, false);
  };

  const handleVerifiser = async () => {
    // Clear previous errors
    setFnrError(null);
    setEtternavnError(null);
    setVerifiseringFeil(null);

    // Validate input with Zod
    const validationResult = arbeidstakerSchema.safeParse({ fnr, etternavn });

    if (!validationResult.success) {
      // Show field-specific validation errors
      for (const error of validationResult.error.issues) {
        if (error.path[0] === "fnr") {
          setFnrError(t(error.message));
        } else if (error.path[0] === "etternavn") {
          setEtternavnError(t(error.message));
        }
      }
      return;
    }

    setVerifiserer(true);

    try {
      const response = await verifiserPerson({
        fodselsnummer: fnr,
        etternavn,
      });

      // Success response means person is verified
      setVerifisertPerson({
        fnr,
        etternavn,
        navn: response.navn,
      });
      setVerifiseringFeil(null);

      if (onArbeidstakerValgt) {
        onArbeidstakerValgt(
          {
            fnr,
            navn: response.navn,
            etternavn, // Etternavn fra brukerens input (for backend-validering)
            fodselsdato: response.fodselsdato,
          },
          false,
        ); // Uten fullmakt
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
    setFnrError(null);
    setEtternavnError(null);
    setVerifiseringFeil(null);
    setUtenFullmaktHarFokus(false);
    onArbeidstakerValgt?.(undefined, false);
  };

  return (
    <div>
      <Heading className="mt-4" level="3" size="small" spacing>
        {t("oversiktFelles.arbeidstakerTittel")}
      </Heading>

      <Box
        borderColor={harFeil ? "border-danger" : "border-info"}
        borderWidth="0 0 0 4"
        paddingInline="4"
      >
        <VStack gap="6">
          {/* Med fullmakt */}
          <div
            className="navds-form-field navds-form-field--medium"
            style={{
              opacity: skalDisableMedFullmakt ? 0.5 : 1,
              pointerEvents: skalDisableMedFullmakt ? "none" : "auto",
            }}
          >
            <Label className="navds-form-field__label">
              {t("oversiktFelles.arbeidstakerMedFullmaktLabel")}
            </Label>
            <BodyShort className="navds-form-field__description">
              {t("oversiktFelles.arbeidstakerMedFullmaktBeskrivelse")}
            </BodyShort>

            <div className="max-w-lg w-full">
              {harValgtMedFullmakt ? (
                <Box
                  background="surface-default"
                  borderColor="border-subtle"
                  borderRadius="small"
                  borderWidth="1"
                  className="mt-2"
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
                // Vi bruker tom label="" fordi vi viser egen Label og BodyShort over
                // for å sikre at label og beskrivelse er synlig både når Combobox
                // vises og når valgt person vises i boks. Combobox har ikke innebygd clear-knapp.
                <UNSAFE_Combobox
                  error={
                    error ? "Kunne ikke laste personer med fullmakt" : undefined
                  }
                  isLoading={isLoading}
                  label=""
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
          </div>

          {/* Uten fullmakt - skjules hvis visKunMedFullmakt er true */}
          {!visKunMedFullmakt && (
            <div
              className="navds-form-field navds-form-field--medium"
              style={{
                opacity: skalDisableUtenFullmakt ? 0.5 : 1,
                pointerEvents: skalDisableUtenFullmakt ? "none" : "auto",
              }}
            >
            <Label className="navds-form-field__label">
              {t("oversiktFelles.arbeidstakerUtenFullmaktTittel")}
            </Label>
            <BodyShort className="navds-form-field__description">
              {t("oversiktFelles.arbeidstakerUtenFullmaktBeskrivelse")}
            </BodyShort>

            <div className="max-w-lg w-full">
              {verifisertPerson ? (
                <Box
                  background="surface-default"
                  borderColor="border-subtle"
                  borderRadius="small"
                  borderWidth="1"
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
                  <HStack align="start" gap="2" wrap={false}>
                    <TextField
                      error={fnrError ?? undefined}
                      label={t("oversiktFelles.arbeidstakerFnrLabel")}
                      maxLength={FNR_LENGTH}
                      onBlur={() => setUtenFullmaktHarFokus(false)}
                      onChange={(e) => {
                        setFnr(e.target.value);
                        setFnrError(null);
                      }}
                      onFocus={() => setUtenFullmaktHarFokus(true)}
                      value={fnr}
                    />
                    <TextField
                      error={etternavnError ?? undefined}
                      label={t("oversiktFelles.arbeidstakerEtternavnLabel")}
                      onBlur={() => setUtenFullmaktHarFokus(false)}
                      onChange={(e) => {
                        setEtternavn(e.target.value);
                        setEtternavnError(null);
                      }}
                      onFocus={() => setUtenFullmaktHarFokus(true)}
                      value={etternavn}
                    />
                    <Box className="mt-8">
                      <Button
                        loading={verifiserer}
                        onClick={handleVerifiser}
                        variant="secondary"
                      >
                        {t("oversiktFelles.arbeidstakerSokKnapp")}
                      </Button>
                    </Box>
                  </HStack>

                  {verifiseringFeil && (
                    <Alert size="small" variant="error">
                      {verifiseringFeil}
                    </Alert>
                  )}
                </>
              )}
            </div>
          </div>
          )}
        </VStack>
      </Box>
    </div>
  );
}
