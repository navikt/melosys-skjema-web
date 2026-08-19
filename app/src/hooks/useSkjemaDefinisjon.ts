import { useTranslation } from "react-i18next";

import {
  type FeltNavn,
  getFeltForLang,
  getSeksjonForLang,
  getSkjemaDefinisjon,
  type SeksjonsNavn,
} from "~/constants/skjemaDefinisjonA1";
import { mapToSupportedLanguage } from "~/utils/languages.ts";

/**
 * Hook for å hente felt fra skjemadefinisjon basert på nåværende språk.
 * Bruker statisk definisjon fra constants/skjemaDefinisjonA1.ts.
 *
 * @example
 * const { getFelt, getSeksjon } = useSkjemaDefinisjon();
 * const felt = getFelt("arbeidssituasjon", "harVaertEllerSkalVaere...");
 * <Input label={felt.label} />
 */
export function useSkjemaDefinisjon() {
  const { i18n } = useTranslation();
  const lang = mapToSupportedLanguage(i18n.language);

  return {
    definisjon: getSkjemaDefinisjon(lang),
    getSeksjon: <S extends SeksjonsNavn>(seksjonNavn: S) =>
      getSeksjonForLang(lang, seksjonNavn),
    getFelt: <S extends SeksjonsNavn>(seksjonNavn: S, feltNavn: FeltNavn<S>) =>
      getFeltForLang(lang, seksjonNavn, feltNavn),
    lang,
  };
}

// Re-export typer for enkel import
export {
  type FeltNavn,
  type SeksjonsNavn,
  type SupportedLanguage,
} from "~/constants/skjemaDefinisjonA1";

// Backward compatibility - eksporter også norsk definisjon direkte
export {
  SKJEMA_DEFINISJON_A1,
  SKJEMA_DEFINISJONER_A1,
} from "~/constants/skjemaDefinisjonA1";
