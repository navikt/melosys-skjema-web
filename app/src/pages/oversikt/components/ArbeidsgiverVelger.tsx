import {
  Alert,
  BodyShort,
  Box,
  Heading,
  Loader,
  UNSAFE_Combobox,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker.tsx";
import { listAltinnTilganger } from "~/httpClients/melsosysSkjemaApiClient.ts";
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
 * Arbeidsgiver-velger komponent som håndterer flere modi:
 * 1. OrganisasjonSoker: For DEG_SELV og ANNEN_PERSON (søk i Enhetsregisteret)
 * 2. Read-only: Når ARBEIDSGIVER har tilgang til kun én organisasjon
 * 3. Combobox: For RADGIVER eller ARBEIDSGIVER med flere organisasjoner (fra Altinn)
 */
export function ArbeidsgiverVelger({
  kontekst,
  valgtArbeidsgiver,
  onArbeidsgiverValgt,
  harFeil = false,
}: ArbeidsgiverVelgerProps) {
  const { t } = useTranslation();
  const hasAutoSelectedRef = useRef(false);

  const skalHenteArbeidsgivere =
    kontekst.representasjonstype === "RADGIVER" ||
    kontekst.representasjonstype === "ARBEIDSGIVER";

  /**
   * Eager loading: Henter arbeidsgivere fra Altinn for både RADGIVER og ARBEIDSGIVER
   */
  const {
    data: arbeidsgivere,
    isLoading,
    isError,
  } = useQuery({
    ...listAltinnTilganger(),
    enabled: skalHenteArbeidsgivere,
    retry: false,
  });

  /**
   * Auto-select hvis ARBEIDSGIVER har tilgang til kun én organisasjon.
   * Dette skjer som en direkte konsekvens av data-loading, så vi gjør det
   * som en event handler (callback) heller enn som en transformasjon.
   */
  if (
    kontekst.representasjonstype === "ARBEIDSGIVER" &&
    arbeidsgivere?.length === 1 &&
    !valgtArbeidsgiver &&
    !isLoading &&
    !isError &&
    !hasAutoSelectedRef.current
  ) {
    const forstOrg = arbeidsgivere[0];
    if (forstOrg) {
      hasAutoSelectedRef.current = true;
      // Kjør i neste tick for å unngå state-oppdatering under render
      queueMicrotask(() => {
        onArbeidsgiverValgt({
          orgnr: forstOrg.orgnr,
          navn: forstOrg.navn,
        });
      });
    }
  }

  const skalSokeEtterArbeidsgiver =
    kontekst.representasjonstype === "DEG_SELV" ||
    kontekst.representasjonstype === "ANNEN_PERSON";

  const skalViseReadonly =
    kontekst.representasjonstype === "ARBEIDSGIVER" &&
    arbeidsgivere?.length === 1 &&
    !!valgtArbeidsgiver;

  // Konverter OrganisasjonDto til Combobox options med søkbar tekst
  const options = arbeidsgivere
    ? arbeidsgivere.map((org) => ({
        label: `${org.navn} (${org.orgnr})`,
        value: org.orgnr,
      }))
    : [];

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
      <Heading level="3" size="medium" spacing>
        {t("oversiktFelles.arbeidsgiverTittel")}
      </Heading>

      {kontekst.representasjonstype === "ARBEIDSGIVER" &&
      isLoading &&
      !valgtArbeidsgiver ? (
        <Loader size="medium" title={t("felles.laster")} />
      ) : skalViseReadonly && valgtArbeidsgiver ? (
        // Readonly display for ARBEIDSGIVER med kun én organisasjon
        <div>
          <BodyShort size={"medium"} weight="semibold">
            {valgtArbeidsgiver.navn}
          </BodyShort>
          <BodyShort size="small">Org.nr: {valgtArbeidsgiver.orgnr}</BodyShort>
        </div>
      ) : (
        <Box
          borderColor={harFeil ? "border-danger" : "border-info"}
          borderWidth="0 0 0 4"
          paddingInline="4"
        >
          {skalSokeEtterArbeidsgiver ? (
            // OrganisasjonSoker for DEG_SELV og ANNEN_PERSON
            <OrganisasjonSoker
              label={t("oversiktFelles.arbeidsgiverOrgnrLabel")}
              onOrganisasjonValgt={onArbeidsgiverValgt}
            />
          ) : skalHenteArbeidsgivere ? (
            // Henter fra Altinn for RADGIVER og ARBEIDSGIVER
            <div className="max-w-lg w-full">
              {isLoading ? (
                <Loader size="medium" title="Laster..." />
              ) : isError ? (
                <Alert variant="error">
                  {t("oversiktFelles.feilVedHentingAvArbeidsgivere")}
                </Alert>
              ) : !arbeidsgivere || arbeidsgivere.length === 0 ? (
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
                // Combobox for RADGIVER eller ARBEIDSGIVER med flere organisasjoner
                <UNSAFE_Combobox
                  description={t("oversiktFelles.arbeidsgiverVelgerInfo")}
                  label={t("oversiktFelles.arbeidsgiverVelgerLabel")}
                  onToggleSelected={(value) => handleArbeidsgiverValgt(value)}
                  options={options}
                  placeholder={t(
                    "oversiktFelles.arbeidsgiverVelgerPlaceholder",
                  )}
                  shouldAutocomplete
                  size="medium"
                />
              )}
            </div>
          ) : null}
        </Box>
      )}
    </div>
  );
}
