import "./index.css";

import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import i18n from "i18next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";

import { resources } from "./i18n/i18n.ts";
import { routeTree } from "./routeTree.gen";

// Initialize i18n
i18n.use(initReactI18next).init({
  lng: "nb",
  fallbackLng: "nb",
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export const queryClient = new QueryClient();

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

onLanguageSelect((language) => {
  i18n.changeLanguage(language.locale);
});

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
