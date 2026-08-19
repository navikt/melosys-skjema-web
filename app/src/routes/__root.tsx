import { Page, Provider, VStack } from "@navikt/ds-react";
import { en, nb, nn } from "@navikt/ds-react/locales";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AppHeader } from "~/components/AppHeader.tsx";
import type { RouterContext } from "~/main";
import { mapToSupportedLanguage } from "~/utils/languages.ts";

const AKSEL_LOCALES = { nb, nn, en };

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { i18n } = useTranslation();

  return (
    <Provider locale={AKSEL_LOCALES[mapToSupportedLanguage(i18n.language)]}>
      <Page footerPosition="belowFold">
        <div
          style={{
            backgroundColor: "var(--ax-bg-neutral-soft)",
            width: "100%",
          }}
        >
          <Page.Block gutters style={{ paddingInline: "24px" }} width="md">
            <AppHeader />
          </Page.Block>
        </div>
        <Page.Block gutters style={{ paddingInline: "24px" }} width="md">
          <VStack as="main" gap="space-32" paddingBlock="space-32 space-0">
            <Outlet />
          </VStack>
        </Page.Block>
      </Page>
    </Provider>
  );
}
