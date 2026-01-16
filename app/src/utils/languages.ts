import type { DecoratorLocale } from "@navikt/nav-dekoratoren-moduler";

export interface Language {
  code: DecoratorLocale;
  label: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "nb", label: "Norsk" },
  { code: "en", label: "English" },
];
