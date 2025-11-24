import {
  Alert,
  Box,
  Heading,
  TextField,
  UNSAFE_Combobox,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker";
import { listAltinnTilganger } from "~/httpClients/melsosysSkjemaApiClient";
import {
  OpprettSoknadMedKontekstRequest,
  SimpleOrganisasjonDto,
} from "~/types/melosysSkjemaTypes.ts";

interface ArbeidsgiverVelgerProps {
  kontekst: OpprettSoknadMedKontekstRequest;
  valgtArbeidsgiver?: SimpleOrganisasjonDto;
  onArbeidsgiverValgt: (organisasjon: SimpleOrganisasjonDto) => void;
  harFeil?: boolean;
}

/**
 * Arbeidsgiver-velger komponent som håndterer tre modi:
 * 1. Read-only: Når arbeidsgiver allerede er valgt (ARBEIDSGIVER kontekst)
 * 2. OrganisasjonSoker: For DEG_SELV og ANNEN_PERSON
 * 3. Combobox: For RADGIVER (eager loading fra Altinn)
 *
 */
export function ArbeidsgiverVelger({
  kontekst,
  valgtArbeidsgiver,
  onArbeidsgiverValgt,
  harFeil = false,
}: ArbeidsgiverVelgerProps) {
  const { t } = useTranslation();

  /**
   * Eager loading: Henter arbeidsgivere umiddelbart når komponenten rendres
   * Brukeren får beskjed med en gang hvis de ikke har tilganger
   */
  const {
    data: arbeidsgivere,
    isLoading,
    isError,
  } = useQuery({
    ...listAltinnTilganger(),
    enabled: kontekst.representasjonstype === "RADGIVER",
    retry: false,
  });

  const arbeidsgiverErLast = () => {
    return (
      kontekst.representasjonstype === "ARBEIDSGIVER" && kontekst.arbeidsgiver
    );
  };

  const visningArbeidsgiver = kontekst.arbeidsgiver || valgtArbeidsgiver;

  const skalSokeEtterArbeidsgiver = () => {
    return (
      kontekst.representasjonstype === "DEG_SELV" ||
      kontekst.representasjonstype === "ANNEN_PERSON"
    );
  };

  const skalViseArbeidsgiverVelger = () => {
    return kontekst.representasjonstype === "RADGIVER";
  };

  // Konverter OrganisasjonDto til Combobox options med søkbar tekst
  const options = useMemo(() => {
    if (!arbeidsgivere) return [];

    return arbeidsgivere.map((org) => ({
      label: `${org.navn} (${org.orgnr})`,
      value: org.orgnr,
    }));
  }, [arbeidsgivere]);

  const handleArbeidsgiverValgt = (value: string) => {
    const valgtOrganisasjon = arbeidsgivere?.find((org) => org.orgnr === value);

    if (valgtOrganisasjon) {
      onArbeidsgiverValgt({
        orgnr: valgtOrganisasjon.orgnr,
        navn: valgtOrganisasjon.navn,
      });
    }
  };

  return (
    <div>
      <Heading level="3" size="small" spacing>
        {t("oversiktFelles.arbeidsgiverTittel")}
      </Heading>

      {arbeidsgiverErLast() && visningArbeidsgiver ? (
        <TextField
          label={t("oversiktFelles.arbeidsgiverTittel")}
          readOnly
          value={`${visningArbeidsgiver.navn}\nOrg.nr: ${visningArbeidsgiver.orgnr}`}
        />
      ) : (
        <Box
          borderColor={harFeil ? "border-danger" : "border-info"}
          borderWidth="0 0 0 4"
          paddingInline="4"
        >
          {skalSokeEtterArbeidsgiver() ? (
            <OrganisasjonSoker
              label={t("velgRadgiverfirma.sokPaVirksomhet")}
              onOrganisasjonValgt={onArbeidsgiverValgt}
            />
          ) : skalViseArbeidsgiverVelger() ? (
            <div className="max-w-lg w-full">
              {!isLoading && !isError && options.length === 0 ? (
                <Alert variant="warning">
                  <Heading level="3" size="small" spacing>
                    {t("oversiktFelles.ingenArbeidsgivereTittel")}
                  </Heading>
                  <p className="mb-4">
                    {t("oversiktFelles.ingenArbeidsgivereInfo")}
                  </p>
                  {/* TODO: Legg til faktisk URL til Altinn-dokumentasjon */}
                  <a className="navds-link" href="#">
                    {t("oversiktFelles.ingenArbeidsgivereLenke")}
                  </a>
                </Alert>
              ) : (
                <>
                  <UNSAFE_Combobox
                    description={t("oversiktFelles.arbeidsgiverVelgerInfo")}
                    isLoading={isLoading}
                    label={t("oversiktFelles.arbeidsgiverVelgerLabel")}
                    onToggleSelected={(value) => handleArbeidsgiverValgt(value)}
                    options={options}
                    placeholder={t(
                      "oversiktFelles.arbeidsgiverVelgerPlaceholder",
                    )}
                    shouldAutocomplete
                    size="medium"
                  />
                  {isError && (
                    <Alert className="mt-4" variant="error">
                      {t("oversiktFelles.feilVedHentingAvArbeidsgivere")}
                    </Alert>
                  )}
                </>
              )}
            </div>
          ) : null}
        </Box>
      )}
    </div>
  );
}
