import { useQuery } from "@tanstack/react-query";

import { getSkjemaAsArbeidsgiverQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ArbeidsgiversSkjemaDto } from "~/types/melosysSkjemaTypes.ts";

interface ArbeidsgiverStegLoaderProps {
  id: string;
  children: (skjema: ArbeidsgiversSkjemaDto) => React.ReactNode;
}

export function ArbeidsgiverStegLoader({
  id,
  children,
}: ArbeidsgiverStegLoaderProps) {

  const {
    data: skjema,
    isLoading,
    error,
  } = useQuery(getSkjemaAsArbeidsgiverQuery(id));

  if (isLoading) {
    return <div>Laster skjema...</div>;
  }

  if (error) {
    return <div>Feil ved lasting av skjema</div>;
  }

  if (!skjema) {
    return <div>Fant ikke skjema</div>;
  }

  return <>{children(skjema)}</>;
}
