import { getSkjemaAsArbeidsgiverQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { SkjemaStegLoader } from "~/pages/skjema/components/SkjemaStegLoader.tsx";

import { ArbeidsgiverSkjemaProps } from "../types.ts";

interface ArbeidsgiverStegLoaderProps {
  id: string;
  children: (skjema: ArbeidsgiverSkjemaProps["skjema"]) => React.ReactNode;
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
