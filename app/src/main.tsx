import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import i18n from "i18next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { initReactI18next } from "react-i18next";

import { OpprettSoknadMedKontekstRequest } from "~/types/melosysSkjemaTypes.ts";

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
  kontekst?: OpprettSoknadMedKontekstRequest;
}

const router = createRouter({
  scrollRestoration: true,
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
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
