import { Alert, Button, Loader, VStack } from "@navikt/ds-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { getVentendeMotpartSoknaderQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  byggMotpartSoknad,
  huskNySoknad,
  skjemaStartSearch,
} from "~/pages/skjema/nySoknad.ts";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

const searchSchema = z.object({
  skjemaId: z.coerce.string().optional(),
  arbeidsgiverOrgnr: z.coerce.string().optional(),
});

/**
 * Landingsside for varselet arbeidstaker får når arbeidsgiver har sendt inn sin del.
 * Venter delen fortsatt, går brukeren rett til introsiden som med «Fyll ut din del».
 * Ellers (påbegynt, innsendt, avsluttet, eller motpart-CTA-togglen er av) går brukeren
 * til oversikten med arbeidsgiver forhåndsutfylt, der eventuelle utkast vises.
 */
export const Route = createFileRoute("/fyll-ut-din-del")({
  validateSearch: (search) => searchSchema.parse(search),
  beforeLoad: async ({ context: { queryClient }, search }) => {
    const { soknader } = await queryClient.fetchQuery(
      getVentendeMotpartSoknaderQuery(),
    );
    const soknad = soknader.find(
      ({ skjemaId }) => skjemaId === search.skjemaId,
    );

    if (!soknad) {
      throw redirect({
        to: "/oversikt",
        search: {
          representasjonstype: Representasjonstype.DEG_SELV,
          arbeidsgiverOrgnr: search.arbeidsgiverOrgnr,
        },
        replace: true,
      });
    }

    const nySoknad = await byggMotpartSoknad(queryClient, soknad);
    huskNySoknad(nySoknad);
    throw redirect({
      to: "/skjema/start",
      search: skjemaStartSearch(nySoknad),
      replace: true,
    });
  },
  pendingComponent: FyllUtDinDelLaster,
  errorComponent: FyllUtDinDelFeil,
});

function FyllUtDinDelLaster() {
  const { t } = useTranslation();
  return <Loader size="medium" title={t("felles.laster")} />;
}

function FyllUtDinDelFeil() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { arbeidsgiverOrgnr } = Route.useSearch();

  return (
    <VStack align="start" gap="space-16">
      <Alert variant="error">{t("oversiktDegSelv.motpartCtaFeil")}</Alert>
      <Button
        onClick={() =>
          void navigate({
            to: "/oversikt",
            search: {
              representasjonstype: Representasjonstype.DEG_SELV,
              arbeidsgiverOrgnr,
            },
          })
        }
        variant="secondary"
      >
        {t("oversiktDegSelv.motpartLenkeGaTilOversikten")}
      </Button>
    </VStack>
  );
}
