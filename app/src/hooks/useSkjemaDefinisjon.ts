import { useTranslation } from "react-i18next";

import {
  type FeltNavn,
  getFeltForLang,
  getSeksjonForLang,
  getSkjemaDefinisjon,
  type SeksjonsNavn,
} from "~/constants/skjemaDefinisjonA1";
import {
  getFeltForLang as getFeltForLangV2,
  getSeksjonForLang as getSeksjonForLangV2,
  getSkjemaDefinisjon as getSkjemaDefinisjonV2,
} from "~/constants/skjemaDefinisjonA1V2";
import { getSkjemaVersjonsprofil } from "~/constants/skjemaVersjoner.ts";
import { useSkjemaVersjon } from "~/pages/skjema/components/SkjemaVersjonContext.tsx";
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
export function useSkjemaDefinisjon(versjon?: string) {
  const { i18n } = useTranslation();
  const lang = mapToSupportedLanguage(i18n.language);
  const contextVersjon = useSkjemaVersjon();
  const faktiskVersjon = versjon ?? contextVersjon;
  if (!faktiskVersjon) {
    throw new Error("Skjemadefinisjonsversjon mangler");
  }
  const { definisjonsversjon } = getSkjemaVersjonsprofil(faktiskVersjon);
  const brukV2Definisjon = definisjonsversjon === "2";

  return {
    definisjon: brukV2Definisjon
      ? getSkjemaDefinisjonV2(lang)
      : getSkjemaDefinisjon(lang),
    getSeksjon: <S extends SeksjonsNavn>(seksjonNavn: S) =>
      brukV2Definisjon
        ? getSeksjonForLangV2(lang, seksjonNavn)
        : getSeksjonForLang(lang, seksjonNavn),
    getFelt: <S extends SeksjonsNavn>(seksjonNavn: S, feltNavn: FeltNavn<S>) =>
      brukV2Definisjon
        ? getFeltForLangV2(lang, seksjonNavn, feltNavn as never)
        : getFeltForLang(lang, seksjonNavn, feltNavn),
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
