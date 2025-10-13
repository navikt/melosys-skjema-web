import { Detail, ErrorMessage, HStack, Loader } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";

import { getSkjemaAsArbeidstakerQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ArbeidstakersSkjemaDto } from "~/types/melosysSkjemaTypes.ts";

interface ArbeidstakerStegLoaderProps {
  id: string;
  children: (skjema: ArbeidstakersSkjemaDto) => React.ReactNode;
}

export function ArbeidstakerStegLoader({
  id,
  children,
}: ArbeidstakerStegLoaderProps) {
  const {
    data: skjema,
    isLoading,
    error,
  } = useQuery(getSkjemaAsArbeidstakerQuery(id));

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
