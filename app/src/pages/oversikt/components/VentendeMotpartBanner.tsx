import {
  Alert,
  BodyLong,
  Button,
  ErrorMessage,
  Heading,
  VStack,
} from "@navikt/ds-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { MOTPART_CTA } from "~/featuretoggle/toggleNavn.ts";
import { useFeatureToggle } from "~/featuretoggle/useFeatureToggle.ts";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import {
  getOrganisasjonMedJuridiskEnhetQuery,
  getVentendeMotpartSoknaderQuery,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { useGaTilSkjemaStart } from "~/pages/skjema/nySoknad.ts";
import {
  OpprettetVia,
  Representasjonstype,
  VentendeMotpartSoknadDto,
} from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";
import { formatDato } from "~/utils/datoformat.ts";

interface VentendeMotpartBannerProperties {
  representasjonskontekst: Representasjonskontekst;
}

/**
 * Oppfordring til arbeidstaker om å fylle ut sin del når arbeidsgiver allerede
 * har sendt inn sin. Vises kun for DEG_SELV og bak toggle `melosys.skjema.motpart-cta`.
 *
 * Knappen sender brukeren rett til introsiden (/skjema/start) med arbeidsgiver,
 * arbeidstaker og prefyll fra arbeidsgivers del; utkastet opprettes etter bekreftelse.
 */
export function VentendeMotpartBanner({
  representasjonskontekst,
}: VentendeMotpartBannerProperties) {
  const ctaAktiv = useFeatureToggle(MOTPART_CTA) ?? false;
  const erDegSelv =
    representasjonskontekst.representasjonstype ===
    Representasjonstype.DEG_SELV;

  const { data } = useQuery({
    ...getVentendeMotpartSoknaderQuery(),
    enabled: ctaAktiv && erDegSelv,
  });

  return !ctaAktiv ||
    !erDegSelv ||
    !data ||
    data.soknader.length === 0 ? null : (
    <VStack gap="space-16">
      {data.soknader.map((soknad) => (
        <VentendeMotpartAlert key={soknad.skjemaId} soknad={soknad} />
      ))}
    </VStack>
  );
}

function VentendeMotpartAlert({
  soknad,
}: {
  soknad: VentendeMotpartSoknadDto;
}) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const gaTilSkjemaStart = useGaTilSkjemaStart();

  const startDinDel = useMutation({
    mutationFn: async () => {
      // Samme oppslag som søknadsstarteren: arbeidsgiver lagres som juridisk enhet.
      const [organisasjon, bruker] = await Promise.all([
        queryClient.fetchQuery(
          getOrganisasjonMedJuridiskEnhetQuery(soknad.arbeidsgiverOrgnr),
        ),
        queryClient.ensureQueryData(getUserInfo()),
      ]);
      await gaTilSkjemaStart({
        request: {
          representasjonstype: Representasjonstype.DEG_SELV,
          arbeidsgiver: {
            orgnr: organisasjon.juridiskEnhet.orgnr,
            // API-et krever navn; bruk navnet fra arbeidsgivers del hvis registeret mangler det
            navn: organisasjon.juridiskEnhet.navn || soknad.arbeidsgiverNavn,
          },
          arbeidstaker: { fnr: bruker.userId, etternavn: bruker.name },
          opprettetVia: OpprettetVia.MOTPART_CTA,
          prefyllFraSkjemaId: soknad.skjemaId,
        },
        arbeidstakerNavn: bruker.name,
      });
    },
  });

  return (
    <Alert variant="info">
      <Heading level="2" size="small" spacing>
        {t("oversiktDegSelv.motpartCtaTittel", {
          arbeidsgiverNavn: soknad.arbeidsgiverNavn,
        })}
      </Heading>
      <BodyLong spacing>
        {soknad.utsendingsperiode
          ? t("oversiktDegSelv.motpartCtaBeskrivelse", {
              land: t(
                soknad.utsendelseLand
                  ? `land.${soknad.utsendelseLand}`
                  : "oversiktDegSelv.motpartCtaUtlandetFallback",
              ),
              fraDato: formatDato(
                soknad.utsendingsperiode.fraDato,
                i18n.language,
              ),
              tilDato: formatDato(
                soknad.utsendingsperiode.tilDato,
                i18n.language,
              ),
            })
          : t("oversiktDegSelv.motpartCtaBeskrivelseUtenPeriode")}
      </BodyLong>
      {startDinDel.isError && (
        <ErrorMessage className="mb-4" showIcon size="small">
          {t("oversiktDegSelv.motpartCtaFeil")}
        </ErrorMessage>
      )}
      <Button
        loading={startDinDel.isPending}
        onClick={() => startDinDel.mutate()}
        size="small"
        variant="primary"
      >
        {t("oversiktDegSelv.motpartCtaKnapp")}
      </Button>
    </Alert>
  );
}
