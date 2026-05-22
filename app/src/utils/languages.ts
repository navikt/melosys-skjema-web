import type { DecoratorLocale } from "@navikt/nav-dekoratoren-moduler";

export interface Language {
  code: DecoratorLocale;
  label: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "nb", label: "Norsk" },
  // Aktiver naar oversettelsene er offisielt godkjent (MELOSYS-8094)
  // { code: "en", label: "English" },
  // { code: "nn", label: "Nynorsk" },
];
