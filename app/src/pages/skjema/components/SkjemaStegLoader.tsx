import { Detail, ErrorMessage, HStack, Loader } from "@navikt/ds-react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  ArbeidsgiversSkjemaDto,
  ArbeidstakersSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

type SkjemaDto = ArbeidsgiversSkjemaDto | ArbeidstakersSkjemaDto;

interface SkjemaStegLoaderProps<T extends SkjemaDto> {
  id: string;
  skjemaQuery: (id: string) => UseQueryOptions<T>;
  children: (skjema: T) => React.ReactNode;
}

export function SkjemaStegLoader<T extends SkjemaDto>({
  id,
  skjemaQuery,
  children,
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

  return <>{children(skjema)}</>;
}
