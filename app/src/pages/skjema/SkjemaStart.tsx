import { ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  Button,
  Checkbox,
  ErrorMessage,
  Link,
  VStack,
} from "@navikt/ds-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  opprettSoknad,
  VENTENDE_MOTPART_SOKNADER_QUERY_KEY,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { SkjemaHeader } from "~/pages/skjema/components/SkjemaHeader.tsx";
import {
  glemNySoknad,
  hentNySoknad,
  type NySoknad,
} from "~/pages/skjema/nySoknad.ts";
import { Representasjonstype, Skjemadel } from "~/types/melosysSkjemaTypes.ts";

/**
 * Introside for en ny søknad, etter Aksels mal for søknadsdialoger, men kun med
 * rolleinfo og bekreftelse. Utkastet opprettes først når brukeren har bekreftet
 * at hen vil svare så riktig som mulig.
 */
export function SkjemaStart() {
  const [nySoknad] = useState(hentNySoknad);

  // Uten opplysninger (direkte lenke, ny fane, oppfrisking) finnes det ingenting å starte.
  return nySoknad ? (
    <SkjemaStartInnhold nySoknad={nySoknad} />
  ) : (
    <Navigate replace to="/" />
  );
}

function SkjemaStartInnhold({ nySoknad }: { nySoknad: NySoknad }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feilmeldingId = useId();
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [bekreftet, setBekreftet] = useState(false);
  const [visFeil, setVisFeil] = useState(false);

  const feilmelding =
    visFeil && !bekreftet ? t("skjemaStart.manglerBekreftelse") : undefined;

  // Flytt fokus til avkrysningen så skjermlesere får feilmeldingen lest opp.
  useEffect(() => {
    if (feilmelding) checkboxRef.current?.focus();
  }, [feilmelding]);

  const opprettSoknadMutation = useMutation({
    mutationFn: opprettSoknad,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["utkast"] });
      void queryClient.invalidateQueries({
        queryKey: VENTENDE_MOTPART_SOKNADER_QUERY_KEY,
      });
    },
  });

  const startSoknad = () => {
    if (!bekreftet) {
      setVisFeil(true);
      return;
    }
    opprettSoknadMutation.mutate(nySoknad.request, {
      // Her (ikke i useMutation) så brukeren ikke dras inn i skjemaet hvis hen
      // har navigert bort mens opprettelsen pågikk. replace: tilbake fra
      // skjemaet skal ikke lande på introsiden og gi en ny opprettelse.
      onSuccess: (data) =>
        void navigate({
          to: "/skjema/$id",
          params: { id: data.id },
          replace: true,
        }).then(glemNySoknad),
    });
  };

  const rolleInfo = rolleInfoNokkel(nySoknad.request.representasjonstype);

  return (
    <VStack gap="space-32">
      <SkjemaHeader
        skjemadel={skjemadelFor(nySoknad.request.representasjonstype)}
      />
      {rolleInfo && <BodyLong>{t(rolleInfo)}</BodyLong>}
      <VStack gap="space-16">
        <BodyLong>
          {t("skjemaStart.intro")}{" "}
          <Link
            href={t("skjemaStart.linkUrl")}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("skjemaStart.linkText")}
          </Link>
        </BodyLong>
        <div>
          <Checkbox
            aria-describedby={feilmelding ? feilmeldingId : undefined}
            checked={bekreftet}
            error={!!feilmelding}
            onChange={(event) => setBekreftet(event.target.checked)}
            ref={checkboxRef}
          >
            {t("skjemaStart.bekreftAtVilSvareRiktig")}
          </Checkbox>
          {feilmelding && (
            <ErrorMessage id={feilmeldingId} showIcon size="small">
              {feilmelding}
            </ErrorMessage>
          )}
        </div>
      </VStack>
      {opprettSoknadMutation.isError && (
        <Alert variant="error">{t("skjemaStart.feilVedOpprettelse")}</Alert>
      )}
      <Button
        className="w-fit"
        icon={<ArrowRightIcon aria-hidden />}
        iconPosition="right"
        loading={
          opprettSoknadMutation.isPending || opprettSoknadMutation.isSuccess
        }
        onClick={startSoknad}
        variant="primary"
      >
        {t("skjemaStart.startSoknad")}
      </Button>
    </VStack>
  );
}

function rolleInfoNokkel(representasjonstype: Representasjonstype) {
  switch (representasjonstype) {
    case Representasjonstype.ANNEN_PERSON: {
      return "skjemaStart.annenPersonInfo";
    }
    case Representasjonstype.ARBEIDSGIVER:
    case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT: {
      return "skjemaStart.arbeidsgiverInfo";
    }
    case Representasjonstype.RADGIVER:
    case Representasjonstype.RADGIVER_MED_FULLMAKT: {
      return "skjemaStart.radgiverInfo";
    }
    default: {
      return;
    }
  }
}

// Samme mapping som Representasjonstype.tilSkjemadel() i melosys-skjema-api.
function skjemadelFor(representasjonstype: Representasjonstype): Skjemadel {
  switch (representasjonstype) {
    case Representasjonstype.ARBEIDSGIVER:
    case Representasjonstype.RADGIVER: {
      return Skjemadel.ARBEIDSGIVERS_DEL;
    }
    case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT:
    case Representasjonstype.RADGIVER_MED_FULLMAKT: {
      return Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL;
    }
    case Representasjonstype.DEG_SELV:
    case Representasjonstype.ANNEN_PERSON: {
      return Skjemadel.ARBEIDSTAKERS_DEL;
    }
  }
}
