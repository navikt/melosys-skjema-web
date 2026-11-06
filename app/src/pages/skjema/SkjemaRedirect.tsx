import { InformationSquareIcon } from "@navikt/aksel-icons";
import {
  Detail,
  ErrorMessage,
  HStack,
  InfoCard,
  Loader,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { STATSANSATT_FLYT } from "~/featuretoggle/toggleNavn.ts";
import {
  FeilSkjemaVersjonError,
  getFeatureTogglesQuery,
  getSkjemaQuery,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { getStegRekkefolge } from "~/pages/skjema/stegRekkefølge.ts";

interface SkjemaRedirectProperties {
  id: string;
}

export function SkjemaRedirect({ id }: SkjemaRedirectProperties) {
  const { data: skjema, isLoading, error } = useQuery(getSkjemaQuery(id));
  // MIDLERTIDIG MELOSYS-7694: ikke velg steg før togglevalget er kjent.
  const {
    data: toggles,
    isPending: togglesLaster,
    error: toggleFeil,
  } = useQuery(getFeatureTogglesQuery());
  const { t } = useTranslation();

  if (isLoading || togglesLaster) {
    return (
      <HStack style={{ gap: "var(--a-spacing-2)" }}>
        <Loader />
        <Detail>{t("felles.laster")}</Detail>
      </HStack>
    );
  }

  if (error instanceof FeilSkjemaVersjonError) {
    return (
      <InfoCard data-color="info">
        <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
          {t("felles.skjemaOppdateres")}
        </InfoCard.Message>
      </InfoCard>
    );
  }

  if (
    error ||
    !skjema ||
    toggleFeil ||
    typeof toggles?.[STATSANSATT_FLYT] !== "boolean"
  ) {
    return <ErrorMessage>{t("felles.feil")}</ErrorMessage>;
  }

  const stegRekkefolge = getStegRekkefolge(skjema, toggles[STATSANSATT_FLYT]);

  return <Navigate params={{ id }} replace to={stegRekkefolge[0]!.route} />;
}
