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
      <div style={{ backgroundColor: "var(--ax-bg-neutral-soft)", width: "100%" }}>
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
  );
}
