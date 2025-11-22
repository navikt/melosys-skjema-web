import { Box, Heading, TextField, UNSAFE_Combobox } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker";
import type {
  Organisasjon,
  RepresentasjonskontekstDto,
} from "~/types/representasjon";

interface ArbeidsgiverVelgerProps {
  kontekst: RepresentasjonskontekstDto;
  onArbeidsgiverValgt: (organisasjon: Organisasjon) => void;
}

/**
 * Arbeidsgiver-velger komponent som håndterer tre modi:
 * 1. Read-only: Når arbeidsgiver allerede er valgt (ARBEIDSGIVER kontekst)
 * 2. OrganisasjonSoker: For DEG_SELV og ANNEN_PERSON
 * 3. Combobox: For RADGIVER (TODO: MELOSYS-7725 vil implementere lazy loading fra Altinn)
 */
export function ArbeidsgiverVelger({
  kontekst,
  onArbeidsgiverValgt,
}: ArbeidsgiverVelgerProps) {
  const { t } = useTranslation();

  const arbeidsgiverErLast = () => {
    return kontekst.type === "ARBEIDSGIVER" && kontekst.arbeidsgiver;
  };

  const skalSokeEtterArbeidsgiver = () => {
    return kontekst.type === "DEG_SELV" || kontekst.type === "ANNEN_PERSON";
  };

  const skalViseArbeidsgiverVelger = () => {
    return kontekst.type === "RADGIVER";
  };

  return (
    <div>
      <Heading level="3" size="small" spacing>
        {t("oversiktFelles.arbeidsgiverTittel")}
      </Heading>

      {arbeidsgiverErLast() ? (
        <TextField
          label={t("oversiktFelles.arbeidsgiverTittel")}
          readOnly
          value={`${kontekst.arbeidsgiver!.navn}\nOrg.nr: ${kontekst.arbeidsgiver!.orgnr}`}
        />
      ) : (
        <Box borderColor="border-info" borderWidth="0 0 0 4" paddingInline="4">
          {skalSokeEtterArbeidsgiver() ? (
            <OrganisasjonSoker
              label={t("velgRadgiverfirma.sokPaVirksomhet")}
              onOrganisasjonValgt={onArbeidsgiverValgt}
            />
          ) : skalViseArbeidsgiverVelger() ? (
            <div className="max-w-lg w-full">
              {/* TODO: MELOSYS-7725 vil implementere:
                  - Lazy loading av arbeidsgivere fra Altinn
                  - Søk på både navn og organisasjonsnummer
                  - Validering av tilgang */}
              <UNSAFE_Combobox
                description={t("oversiktFelles.arbeidsgiverVelgerInfo")}
                label={t("oversiktFelles.arbeidsgiverVelgerLabel")}
                options={[]}
              />
            </div>
          ) : null}
        </Box>
      )}
    </div>
  );
}
