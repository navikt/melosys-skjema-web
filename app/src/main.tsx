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
import { Toaster } from "react-hot-toast";
import { initReactI18next } from "react-i18next";

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
  lng: getDecoratorLangFromCookie(),
  fallbackLng: "nb",
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export const queryClient = new QueryClient();

export interface RouterContext {
  queryClient: QueryClient;
}

const router = createRouter({
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
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

// Valider at statisk skjemadefinisjon matcher backend (kun i utvikling)
if (import.meta.env.DEV) {
  logSkjemaDefinisjonValidation();
}
