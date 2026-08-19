import type { DecoratorLocale } from "@navikt/nav-dekoratoren-moduler";

import { Sprak } from "~/types/melosysSkjemaTypes.ts";

export interface Language {
  code: DecoratorLocale;
  label: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "nb", label: "Bokmål" },
  { code: "nn", label: "Nynorsk" },
  { code: "en", label: "English" },
];

export type SupportedLanguageCode = "nb" | "nn" | "en";

/**
 * Mapper en vilkårlig språkkode til et støttet språk, med bokmål som fallback.
 * Decorator-cookien kan inneholde språk appen ikke støtter (se/pl/uk/ru).
 */
export function mapToSupportedLanguage(lang: string): SupportedLanguageCode {
  return lang === "nn" || lang === "en" ? lang : "nb";
}

/**
Som mapToSupportedLanguage, men typet som API-enumen for kall mot backend.
*/
export function toSprak(lang: string): Sprak {
  const code = mapToSupportedLanguage(lang);
  if (code === "nn") return Sprak.Nn;
  if (code === "en") return Sprak.En;
  return Sprak.Nb;
}
