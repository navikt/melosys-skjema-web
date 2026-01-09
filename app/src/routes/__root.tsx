import { Page, VStack } from "@navikt/ds-react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import type { RouterContext } from "~/main";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Page footerPosition="belowFold">
      <Page.Block gutters width="md">
        <VStack as="main" gap="8" paddingBlock="8 0">
          <Outlet />
        </VStack>
      </Page.Block>
    </Page>
  );
}
