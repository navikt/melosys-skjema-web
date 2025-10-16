import { getSkjemaAsArbeidstakerQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { SkjemaStegLoader } from "~/pages/skjema/components/SkjemaStegLoader.tsx";
import { ArbeidstakersSkjemaDto } from "~/types/melosysSkjemaTypes.ts";

interface ArbeidstakerStegLoaderProps {
  id: string;
  children: (skjema: ArbeidstakersSkjemaDto) => React.ReactNode;
}

export function ArbeidstakerStegLoader({
  id,
  children,
}: ArbeidstakerStegLoaderProps) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaAsArbeidstakerQuery}>
      {children}
    </SkjemaStegLoader>
  );
}
