import {
  en as akselEn,
  nb as akselNb,
  nn as akselNn,
} from "@navikt/ds-react/locales";

import { en } from "~/i18n/en";
import { nb } from "~/i18n/nb";
import { nn } from "~/i18n/nn";

export type E2eSprak = "nb" | "nn" | "en";

const bundles = { nb, nn, en } as const;

/** Aktivt testspråk — styres med E2E_SPRAK-miljøvariabelen, default bokmål. */
export const E2E_SPRAK: E2eSprak =
  process.env.E2E_SPRAK === "nn" || process.env.E2E_SPRAK === "en"
    ? process.env.E2E_SPRAK
    : "nb";

/**
 * Oversettelsene for aktivt testspråk. Page objects og specs skal referere
 * denne — aldri nb-bundlen direkte — så suiten ikke er strukturelt låst til bokmål.
 */
export const translations = bundles[E2E_SPRAK].translation;

const akselBundles = { nb: akselNb, nn: akselNn, en: akselEn } as const;

/** Aksel-komponentenes egne tekster (FileUpload, Search, DatePicker …) for aktivt testspråk. */
export const akselTranslations = akselBundles[E2E_SPRAK];
