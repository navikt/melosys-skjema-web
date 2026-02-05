import {
  Alert,
  BodyLong,
  Box,
  Button,
  Heading,
  VStack,
} from "@navikt/ds-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { opprettSoknadMedKontekst } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  OpprettSoknadMedKontekstRequest,
  PersonDto,
  Representasjonstype,
  SimpleOrganisasjonDto,
  Skjemadel,
} from "~/types/melosysSkjemaTypes.ts";
import { validerSoknadKontekst } from "~/utils/valideringUtils.ts";

import { ArbeidsgiverVelger } from "./ArbeidsgiverVelger.tsx";
import { ArbeidstakerVelger } from "./ArbeidstakerVelger.tsx";

interface SoknadStarterProps {
  kontekst: OpprettSoknadMedKontekstRequest;
}

/**
 * Søknadsstarter-komponent som lar brukeren velge arbeidsgiver og arbeidstaker
 * før søknad startes.
 */
export function SoknadStarter({ kontekst }: SoknadStarterProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [valgtArbeidsgiver, setValgtArbeidsgiver] =
    useState<SimpleOrganisasjonDto>(kontekst.arbeidsgiver);
  const [valgtArbeidstaker, setValgtArbeidstaker] = useState<
    PersonDto | undefined
  >(kontekst.arbeidstaker);
  const [harFullmakt, setHarFullmakt] = useState<boolean>(kontekst.harFullmakt);
  const [valideringsfeil, setValideringsfeil] = useState<string[]>([]);

  // Hent innlogget bruker for DEG_SELV-scenario
  const { data: userInfo } = useQuery(getUserInfo());

  // For DEG_SELV er arbeidstaker alltid innlogget bruker, beregnes direkte
  // For andre typer brukes valgtArbeidstaker fra state
  const effektivArbeidstaker =
    kontekst.representasjonstype === Representasjonstype.DEG_SELV && userInfo
      ? {
          fnr: userInfo.userId,
          etternavn: userInfo.name,
        }
      : valgtArbeidstaker;

  const opprettSoknadMutation = useMutation({
    mutationFn: opprettSoknadMedKontekst,
    onSuccess: (data) => {
      void navigate({
        to: "/skjema/$id",
        params: { id: data.id },
      });
    },
  });

  const validerOgStartSoknad = () => {
    const validering = validerSoknadKontekst(
      kontekst,
      valgtArbeidsgiver,
      effektivArbeidstaker,
    );

    const feil: string[] = [];
    if (validering.manglerArbeidsgiver) {
      feil.push(t("oversiktFelles.valideringManglerArbeidsgiver"));
    }
    if (validering.manglerArbeidstaker) {
      feil.push(t("oversiktFelles.valideringManglerArbeidstaker"));
    }

    if (!validering.gyldig) {
      setValideringsfeil(feil);
      return;
    }

    // Clear valideringsfeil hvis alt er ok
    setValideringsfeil([]);

    // TODO: Det kommer flere endringer senere som gjøre denne riktig, men dette er det nærmeste vi kommer nå
    const skjemadel = [
      Representasjonstype.RADGIVER,
      Representasjonstype.ARBEIDSGIVER,
    ].includes(kontekst.representasjonstype)
      ? Skjemadel.ARBEIDSGIVERS_DEL
      : Skjemadel.ARBEIDSTAKERS_DEL;

    // Opprett søknad direkte
    const request: OpprettSoknadMedKontekstRequest = {
      representasjonstype: kontekst.representasjonstype,
      radgiverfirma: kontekst.radgiverfirma,
      arbeidsgiver: valgtArbeidsgiver,
      arbeidstaker: effektivArbeidstaker!, // Validated above
      skjemadel,
      harFullmakt,
    };

    opprettSoknadMutation.mutate(request);
  };

  // Clear valideringsfeil når arbeidsgiver/arbeidstaker endres
  const handleArbeidsgiverValgt = (organisasjon: SimpleOrganisasjonDto) => {
    setValgtArbeidsgiver(organisasjon);
    // Fjern arbeidsgiver-feil hvis den finnes
    setValideringsfeil((prev) =>
      prev.filter(
        (feil) => feil !== t("oversiktFelles.valideringManglerArbeidsgiver"),
      ),
    );
  };

  const handleArbeidstakerValgt = (
    person?: PersonDto,
    medFullmakt?: boolean,
  ) => {
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
      background="info-soft"
      borderColor="neutral-subtle"
      borderRadius="2"
      borderWidth="1"
      className="surface-action-subtle"
      padding="space-24"
    >
      <VStack gap="space-24">
        <div>
          <Heading level="2" size="medium" spacing>
            {kontekst.representasjonstype === Representasjonstype.DEG_SELV
              ? t("oversiktFelles.soknadStarterTittelDegSelv")
              : kontekst.representasjonstype ===
                  Representasjonstype.ANNEN_PERSON
                ? t("oversiktFelles.soknadStarterTittelAnnenPerson")
                : t("oversiktFelles.soknadStarterTittel")}
          </Heading>
          {kontekst.representasjonstype ===
            Representasjonstype.ANNEN_PERSON && (
            <BodyLong spacing>
              {t("oversiktFelles.soknadStarterInfoAnnenPerson")}
            </BodyLong>
          )}
          {(kontekst.representasjonstype === Representasjonstype.RADGIVER ||
            kontekst.representasjonstype ===
              Representasjonstype.ARBEIDSGIVER) && (
            <BodyLong spacing>{t("oversiktFelles.soknadStarterInfo")}</BodyLong>
          )}
        </div>

        {/* For ANNEN_PERSON: Person først, så arbeidsgiver */}
        {kontekst.representasjonstype === Representasjonstype.ANNEN_PERSON && (
          <div>
            <ArbeidstakerVelger
              erAnnenPerson
              harFeil={harArbeidstakerFeil}
              onArbeidstakerValgt={handleArbeidstakerValgt}
              visKunMedFullmakt
            />
          </div>
        )}

        <div>
          <ArbeidsgiverVelger
            harFeil={harArbeidsgiverFeil}
            kontekst={kontekst}
            onArbeidsgiverValgt={handleArbeidsgiverValgt}
            valgtArbeidsgiver={valgtArbeidsgiver}
          />
        </div>

        {/* For RADGIVER og ARBEIDSGIVER: Arbeidstaker etter arbeidsgiver */}
        {(kontekst.representasjonstype === Representasjonstype.RADGIVER ||
          kontekst.representasjonstype ===
            Representasjonstype.ARBEIDSGIVER) && (
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

        {opprettSoknadMutation.isError && (
          <Alert variant="error">
            {t("oversiktFelles.feilVedOpprettelse")}
          </Alert>
        )}

        <Button
          className="w-fit"
          loading={opprettSoknadMutation.isPending}
          onClick={validerOgStartSoknad}
          variant="primary"
        >
          {t("oversiktFelles.gaTilSkjemaKnapp")}
        </Button>
      </VStack>
    </Box>
  );
}
