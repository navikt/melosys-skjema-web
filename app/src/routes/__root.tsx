import { Page, VStack } from "@navikt/ds-react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { AppHeader } from "~/components/AppHeader.tsx";
import type { RouterContext } from "~/main";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Page footerPosition="belowFold">
      <Page.Block gutters style={{ paddingInline: "24px" }} width="md">
        <VStack as="main" gap="space-32" paddingBlock="space-32 space-0">
          <AppHeader />
          <Outlet />
        </VStack>
      </Page.Block>
    </Page>
  );
}
