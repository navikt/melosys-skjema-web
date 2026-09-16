import { Detail, ErrorMessage, HStack, Loader } from "@navikt/ds-react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { StegKey } from "~/constants/stegKeys.ts";
import { getStegRekkefolge } from "~/pages/skjema/stegRekkefølge.ts";
import {
  Skjemadel,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

interface SkjemaStegLoaderProperties<T extends UtsendtArbeidstakerSkjemaDto> {
  id: string;
  skjemaQuery: (id: string) => UseQueryOptions<T>;
  children: (skjema: T) => React.ReactNode;
  allowedSkjemadeler?: Skjemadel[];
  stepKey?: StegKey;
}

export function SkjemaStegLoader<T extends UtsendtArbeidstakerSkjemaDto>({
  id,
  skjemaQuery,
  children,
  allowedSkjemadeler,
  stepKey,
}: SkjemaStegLoaderProperties<T>) {
  const { data: skjema, isLoading, error } = useQuery(skjemaQuery(id));
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <HStack style={{ gap: "var(--a-spacing-2)" }}>
        <Loader />
        <Detail>{t("felles.laster")}</Detail>
      </HStack>
    );
  }

  if (error) {
    return <ErrorMessage>{t("felles.feilVedLastingAvSkjema")}</ErrorMessage>;
  }

  if (!skjema) {
    return <ErrorMessage>{t("felles.fantIkkeSkjema")}</ErrorMessage>;
  }

  if (
    allowedSkjemadeler &&
    !allowedSkjemadeler.includes(skjema.metadata.skjemadel)
  ) {
    return <ErrorMessage>{t("felles.stegIkkeTilgjengelig")}</ErrorMessage>;
  }

  const stegRekkefolge = getStegRekkefolge(skjema);
  if (stepKey && stegRekkefolge.every(({ key }) => key !== stepKey)) {
    const nesteSteg =
      stegRekkefolge.find(({ key }) => key === StegKey.UTENLANDSOPPDRAGET) ??
      stegRekkefolge[0];
    return <Navigate params={{ id }} to={nesteSteg!.route} replace />;
  }

  return <>{children(skjema)}</>;
}
