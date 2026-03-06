import { Detail, ErrorMessage, HStack, Loader } from "@navikt/ds-react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  Skjemadel,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

interface SkjemaStegLoaderProps<T extends UtsendtArbeidstakerSkjemaDto> {
  id: string;
  skjemaQuery: (id: string) => UseQueryOptions<T>;
  children: (skjema: T) => React.ReactNode;
  allowedSkjemadeler?: Skjemadel[];
}

export function SkjemaStegLoader<T extends UtsendtArbeidstakerSkjemaDto>({
  id,
  skjemaQuery,
  children,
  allowedSkjemadeler,
}: SkjemaStegLoaderProps<T>) {
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

  return <>{children(skjema)}</>;
}
