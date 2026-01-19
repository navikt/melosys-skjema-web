import { useTranslation } from "react-i18next";

import {
  type FeltNavn,
  getFeltForLang,
  getSeksjonForLang,
  getSkjemaDefinisjon,
  type SeksjonsNavn,
  type SupportedLanguage,
} from "~/constants/skjemaDefinisjonA1";

/**
 * Mapper i18n språkkode til støttet skjemadefinisjon-språk.
 * Fallback til 'nb' hvis språket ikke støttes.
 */
function mapToSupportedLanguage(i18nLang: string): SupportedLanguage {
  if (i18nLang === "en") return "en";
  return "nb"; // Fallback til norsk
}

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
