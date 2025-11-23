import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  VStack,
} from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type {
  Organisasjon,
  Person,
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
 */
export function SoknadStarter({ kontekst }: SoknadStarterProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [valgtArbeidsgiver, setValgtArbeidsgiver] = useState<
    Organisasjon | undefined
  >(kontekst.arbeidsgiver);
  const [valgtArbeidstaker, setValgtArbeidstaker] = useState<
    Person | undefined
  >(kontekst.arbeidstaker);
  const [harFullmakt, setHarFullmakt] = useState<boolean>(kontekst.harFullmakt);
  const [valideringsfeil, setValideringsfeil] = useState<string[]>([]);

  const validerOgGaVidere = () => {
    const feil: string[] = [];

    // Valider arbeidsgiver (kun for ARBEIDSGIVER og RADGIVER)
    if (
      (kontekst.type === "ARBEIDSGIVER" || kontekst.type === "RADGIVER") &&
      !valgtArbeidsgiver
    ) {
      feil.push(t("oversiktFelles.valideringManglerArbeidsgiver"));
    }

    // Valider arbeidstaker (ikke for DEG_SELV)
    if (kontekst.type !== "DEG_SELV" && !valgtArbeidstaker) {
      feil.push(t("oversiktFelles.valideringManglerArbeidstaker"));
    }

    if (feil.length > 0) {
      setValideringsfeil(feil);
      return;
    }

    // Clear valideringsfeil hvis alt er ok
    setValideringsfeil([]);

    // Naviger til oppsummeringssiden med state
    void navigate({
      to: "/oversikt/start-soknad",

      state: {
        arbeidsgiver: valgtArbeidsgiver,
        arbeidstaker: valgtArbeidstaker,
        kontekst: {
          ...kontekst,
          harFullmakt,
        },
      } as never,
    });
  };

  // Clear valideringsfeil når arbeidsgiver/arbeidstaker endres
  const handleArbeidsgiverValgt = (organisasjon: Organisasjon) => {
    setValgtArbeidsgiver(organisasjon);
    // Fjern arbeidsgiver-feil hvis den finnes
    setValideringsfeil((prev) =>
      prev.filter(
        (feil) => feil !== t("oversiktFelles.valideringManglerArbeidsgiver"),
      ),
    );
  };

  const handleArbeidstakerValgt = (person?: Person, medFullmakt?: boolean) => {
    setValgtArbeidstaker(person);
    setHarFullmakt(medFullmakt ?? false);
    // Fjern arbeidstaker-feil hvis den finnes
    setValideringsfeil((prev) =>
      prev.filter(
        (feil) => feil !== t("oversiktFelles.valideringManglerArbeidstaker"),
      ),
    );
  };

  const harArbeidsgiverFeil = valideringsfeil.includes(
    t("oversiktFelles.valideringManglerArbeidsgiver"),
  );
  const harArbeidstakerFeil = valideringsfeil.includes(
    t("oversiktFelles.valideringManglerArbeidstaker"),
  );

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

        <div>
          <ArbeidsgiverVelger
            harFeil={harArbeidsgiverFeil}
            kontekst={kontekst}
            onArbeidsgiverValgt={handleArbeidsgiverValgt}
            valgtArbeidsgiver={valgtArbeidsgiver}
          />
        </div>

        {kontekst.type !== "DEG_SELV" && (
          <div>
            <ArbeidstakerVelger
              harFeil={harArbeidstakerFeil}
              onArbeidstakerValgt={handleArbeidstakerValgt}
            />
          </div>
        )}

        {valideringsfeil.length > 0 && (
          <Alert variant="error">
            <Heading level="3" size="small" spacing>
              {t("oversiktFelles.valideringFeilTittel")}
            </Heading>
            <ul className="list-disc pl-5">
              {valideringsfeil.map((feil, index) => (
                <li key={index}>{feil}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Button className="w-fit" onClick={validerOgGaVidere} variant="primary">
          {t("oversiktFelles.gaTilSkjemaKnapp")}
        </Button>
      </VStack>
    </Box>
  );
}
