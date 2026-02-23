import { XMarkIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  InlineMessage,
  Label,
  Link,
  TextField,
  UNSAFE_Combobox,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import {
  getPersonerMedFullmaktQuery,
  verifiserPerson,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { PersonMedFullmaktDto } from "~/types/melosysSkjemaTypes.ts";

import { SoknadStarterFormData } from "./soknadStarterSchema.ts";

const FNR_LENGTH = 11;

interface ArbeidstakerVelgerProps {
  visKunMedFullmakt?: boolean;
  erAnnenPerson?: boolean;
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
    message: "oversiktFelles.arbeidstakerFulltNavnTom",
  }),
});

/**
 * Arbeidstaker-velger komponent med to valg:
 * 1. Med fullmakt: Combobox for valg fra liste av personer med fullmakt
 * 2. Uten fullmakt: Manuell input av fnr/d-nr og etternavn med verifisering
 *
 * @param visKunMedFullmakt - Hvis true, skjuler "uten fullmakt" seksjonen (brukes for ANNEN_PERSON)
 * @param erAnnenPerson
 */
export function ArbeidstakerVelger({
  visKunMedFullmakt = false,
  erAnnenPerson = false,
}: ArbeidstakerVelgerProps) {
  const { t } = useTranslation();

  const {
    setValue,
    formState: { errors },
  } = useFormContext<SoknadStarterFormData>();

  const harFeil = !!errors.arbeidstaker;
  const skalFylleUtForArbeidstaker = useWatch<SoknadStarterFormData>({
    name: "skalFylleUtForArbeidstaker",
  });

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

  // For ARBEIDSGIVER/RADGIVER: radioen styrer hva som vises
  const visRadio = !erAnnenPerson && !visKunMedFullmakt;
  const visMedFullmakt =
    erAnnenPerson || visKunMedFullmakt || skalFylleUtForArbeidstaker === true;
  const visUtenFullmakt =
    !visKunMedFullmakt &&
    !erAnnenPerson &&
    skalFylleUtForArbeidstaker === false;

  const handleComboboxChange = (value: string) => {
    const person = personerMedFullmakt.find((p) => p.fnr === value);

    if (person) {
      setSelectedPersonFnr(person.fnr);
      // Clear validation errors from "uten fullmakt" section
      setFnrError(null);
      setEtternavnError(null);
      // Set arbeidstaker and harFullmakt in form
      setValue("arbeidstaker", {
        fnr: person.fnr,
        etternavn: person.navn,
      });
      setValue("harFullmakt", true);
    }
  };

  const handleClearMedFullmakt = () => {
    setSelectedPersonFnr(undefined);
    setValue("arbeidstaker", undefined);
    setValue("harFullmakt", false);
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

      // Set arbeidstaker in form (uten fullmakt)
      setValue("arbeidstaker", {
        fnr,
        etternavn: etternavn, // Etternavn fra brukerens input (for backend-validering)
      });
      setValue("harFullmakt", false);
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
    setValue("arbeidstaker", undefined);
    setValue("harFullmakt", false);
  };

  return (
    <div>
      {!erAnnenPerson && (
        <Heading className="mt-4" level="3" size="medium" spacing>
          {t("oversiktFelles.arbeidstakerTittel")}
        </Heading>
      )}
      <Box
        borderColor={harFeil ? "danger" : "info"}
        borderWidth="0 0 0 4"
        paddingInline="space-16"
      >
        <VStack gap="space-24">
          {/* Radio for ARBEIDSGIVER/RADGIVER */}
          {visRadio && (
            <RadioGroupJaNeiFormPart
              formFieldName="skalFylleUtForArbeidstaker"
              legend={t("oversiktFelles.skalFylleUtForArbeidstakerLabel")}
            />
          )}

          {/* Med fullmakt */}
          {visMedFullmakt && (
            <div className="navds-form-field navds-form-field--medium">
              <Label className="navds-form-field__label">
                {erAnnenPerson
                  ? t("oversiktAnnenPerson.personVelgerLabel")
                  : t("oversiktFelles.arbeidstakerMedFullmaktLabel")}
              </Label>
              <BodyShort className="navds-form-field__description">
                {erAnnenPerson
                  ? t("oversiktAnnenPerson.personVelgerBeskrivelse")
                  : t("oversiktFelles.arbeidstakerMedFullmaktBeskrivelse")}
              </BodyShort>

              <div className="max-w-lg w-full">
                {harValgtMedFullmakt ? (
                  <Box
                    background="default"
                    borderColor="neutral-subtle"
                    borderRadius="2"
                    borderWidth="1"
                    className="mt-2"
                    padding="space-8"
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
                ) : !isLoading && personerMedFullmakt.length === 0 ? (
                  <InlineMessage className="mt-2" status="info">
                    {t("oversiktFelles.arbeidstakerIngenFullmakter")}{" "}
                    <Link
                      href="https://www.nav.no/fullmakt"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      nav.no/fullmakt
                    </Link>
                  </InlineMessage>
                ) : (
                  // Vi bruker tom label="" fordi vi viser egen Label og BodyShort over
                  // for å sikre at label og beskrivelse er synlig både når Combobox
                  // vises og når valgt person vises i boks. Combobox har ikke innebygd clear-knapp.
                  <UNSAFE_Combobox
                    error={
                      error
                        ? "Kunne ikke laste personer med fullmakt"
                        : undefined
                    }
                    isLoading={isLoading}
                    label=""
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
          )}

          {/* Uten fullmakt */}
          {visUtenFullmakt && (
            <div className="max-w-lg w-full">
              {verifisertPerson ? (
                <Box
                  background="default"
                  borderColor="neutral-subtle"
                  borderRadius="2"
                  borderWidth="1"
                  padding="space-8"
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
                  <HStack align="start" gap="space-8" wrap={false}>
                    <TextField
                      error={fnrError ?? undefined}
                      label={t("oversiktFelles.arbeidstakerFnrLabel")}
                      maxLength={FNR_LENGTH}
                      onChange={(e) => {
                        setFnr(e.target.value);
                        setFnrError(null);
                      }}
                      value={fnr}
                    />
                    <TextField
                      error={etternavnError ?? undefined}
                      label={t("oversiktFelles.arbeidstakerFulltNavnLabel")}
                      onChange={(e) => {
                        setEtternavn(e.target.value);
                        setEtternavnError(null);
                      }}
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
          )}
        </VStack>
      </Box>
    </div>
  );
}
