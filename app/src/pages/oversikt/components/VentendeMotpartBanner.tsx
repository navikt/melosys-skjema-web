import { Alert, BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { MOTPART_CTA } from "~/featuretoggle/toggleNavn.ts";
import { useFeatureToggle } from "~/featuretoggle/useFeatureToggle.ts";
import { getVentendeMotpartSoknaderQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  OpprettetVia,
  Representasjonstype,
  VentendeMotpartSoknadDto,
} from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";
import { formatDato } from "~/utils/datoformat.ts";

interface VentendeMotpartBannerProps {
  representasjonskontekst: Representasjonskontekst;
}

/**
 * Oppfordring til arbeidstaker om å fylle ut sin del når arbeidsgiver allerede
 * har sendt inn sin. Vises kun for DEG_SELV og bak toggle `melosys.skjema.motpart-cta`.
 *
 * Knappen navigerer til oversikten med arbeidsgivers orgnr forhåndsutfylt i
 * søknadsstarteren; bekreftelsen må fortsatt hukes av som vanlig.
 */
export function VentendeMotpartBanner({
  representasjonskontekst,
}: VentendeMotpartBannerProps) {
  const ctaAktiv = useFeatureToggle(MOTPART_CTA) ?? false;
  const erDegSelv =
    representasjonskontekst.representasjonstype ===
    Representasjonstype.DEG_SELV;

  const { data } = useQuery({
    ...getVentendeMotpartSoknaderQuery(),
    enabled: ctaAktiv && erDegSelv,
  });

  if (!ctaAktiv || !erDegSelv || !data || data.soknader.length === 0) {
    return null;
  }

  return (
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
  const navigate = useNavigate();

  const startDinDel = () => {
    void navigate({
      to: "/oversikt",
      search: {
        representasjonstype: Representasjonstype.DEG_SELV,
        arbeidsgiverOrgnr: soknad.arbeidsgiverOrgnr,
        opprettetVia: OpprettetVia.MOTPART_CTA,
      },
    });
  };

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
      <Button onClick={startDinDel} size="small" variant="primary">
        {t("oversiktDegSelv.motpartCtaKnapp")}
      </Button>
    </Alert>
  );
}
