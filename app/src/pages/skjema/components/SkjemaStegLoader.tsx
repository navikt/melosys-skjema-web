import { Detail, ErrorMessage, HStack, Loader } from "@navikt/ds-react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

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

  if (isLoading) {
    return (
      <HStack style={{ gap: "var(--a-spacing-2)" }}>
        <Loader />
        <Detail>Laster skjema</Detail>
      </HStack>
    );
  }

  if (error) {
    return <ErrorMessage>Feil ved lasting av skjema</ErrorMessage>;
  }

  if (!skjema) {
    return <ErrorMessage>Fant ikke skjema</ErrorMessage>;
  }

  if (
    allowedSkjemadeler &&
    !allowedSkjemadeler.includes(skjema.metadata.skjemadel)
  ) {
    return (
      <ErrorMessage>
        Steget er ikke tilgjengelig for denne skjemadelen
      </ErrorMessage>
    );
  }

  return <>{children(skjema)}</>;
}
