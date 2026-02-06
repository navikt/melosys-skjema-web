import { getSkjemaAsArbeidstakerQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ArbeidstakerSkjemaProps } from "~/pages/skjema/arbeidstaker/types.ts";
import { SkjemaStegLoader } from "~/pages/skjema/components/SkjemaStegLoader.tsx";

interface ArbeidstakerStegLoaderProps {
  id: string;
  children: (skjema: ArbeidstakerSkjemaProps["skjema"]) => React.ReactNode;
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
