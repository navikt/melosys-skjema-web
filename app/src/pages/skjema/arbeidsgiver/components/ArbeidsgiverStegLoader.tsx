import { getSkjemaAsArbeidsgiverQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { SkjemaStegLoader } from "~/pages/skjema/components/SkjemaStegLoader.tsx";
import { ArbeidsgiversSkjemaDto } from "~/types/melosysSkjemaTypes.ts";

interface ArbeidsgiverStegLoaderProps {
  id: string;
  children: (skjema: ArbeidsgiversSkjemaDto) => React.ReactNode;
}

export function ArbeidsgiverStegLoader({
  id,
  children,
}: ArbeidsgiverStegLoaderProps) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaAsArbeidsgiverQuery}>
      {children}
    </SkjemaStegLoader>
  );
}
