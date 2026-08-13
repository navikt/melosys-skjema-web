import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRouter,
  parseSearchWith,
  RouterProvider,
  stringifySearchWith,
} from "@tanstack/react-router";
import i18n from "i18next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";

import { mapToSupportedLanguage } from "~/utils/languages.ts";
import { logSkjemaDefinisjonValidation } from "~/utils/validateSkjemaDefinisjon";

import { resources } from "./i18n/i18n.ts";
import { routeTree } from "./routeTree.gen";

// Initialize i18n with language from decorator cookie
const getDecoratorLangFromCookie = () => {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("decorator-language="))
      ?.split("=")[1] || "nb"
  );
};

i18n.use(initReactI18next).init({
  // Cookien kan inneholde språk appen ikke støtter (se/pl/uk/ru) — guard mot stille feiltilstand
  lng: mapToSupportedLanguage(getDecoratorLangFromCookie()),
  fallbackLng: "nb",
  supportedLngs: ["nb", "nn", "en"],
  resources,
  interpolation: {
    escapeValue: false,
  },
});

// Sett riktig lang-attributt og fanetittel ved oppstart og ved språkbytte
document.documentElement.lang = mapToSupportedLanguage(i18n.language);
document.title = i18n.t("appHeader.tittel");
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = mapToSupportedLanguage(lng);
  document.title = i18n.t("appHeader.tittel");
});

export const queryClient = new QueryClient();

export interface RouterContext {
  queryClient: QueryClient;
}

const router = createRouter({
  // Basepath må matche Vite sin `base` slik at client-side routing
  // jobber relativt til /medlemskap-lovvalg/soknad/ i prod og "/" lokalt
  basepath: import.meta.env.BASE_URL,
  scrollRestoration: true,
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Ikke JSON-serialiser search params — bruker plain key=value i URL-en
  // slik at f.eks. orgnr vises som radgiverOrgnr=123456789 i stedet for
  // radgiverOrgnr=%22123456789%22
  stringifySearch: stringifySearchWith(String),
  parseSearch: parseSearchWith((value) => value),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

// Valider at statisk skjemadefinisjon matcher backend (kun i utvikling, og ikke under Playwright der backend ikke kjører)
if (import.meta.env.DEV && !navigator.webdriver) {
  logSkjemaDefinisjonValidation();
}
