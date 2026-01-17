import {
  getFelt as getStaticFelt,
  getSeksjon as getStaticSeksjon,
  SKJEMA_DEFINISJON_A1,
} from "~/constants/skjemaDefinisjonA1";

/**
 * Hook for å hente felt fra skjemadefinisjon.
 * Bruker statisk definisjon fra constants/skjemaDefinisjonA1.ts.
 *
 * @example
 * const { getFelt, getSeksjon } = useSkjemaDefinisjon();
 * const felt = getFelt("arbeidssituasjon", "harVaertEllerSkalVaere...");
 * <Input label={felt.label} />
 */
export function useSkjemaDefinisjon() {
  return {
    definisjon: SKJEMA_DEFINISJON_A1,
    getSeksjon: getStaticSeksjon,
    getFelt: getStaticFelt,
  };
}

// Re-export typer for enkel import

export {
  type FeltNavn,
  type SeksjonsNavn,
  SKJEMA_DEFINISJON_A1,
} from "~/constants/skjemaDefinisjonA1";
