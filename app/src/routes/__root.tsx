import { Page, VStack } from "@navikt/ds-react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { SoknadHeader } from "~/components/SoknadHeader";
import type { RouterContext } from "~/main";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const context = Route.useRouteContext();
  const hideSiteTitle = context.hideSiteTitle ?? false;

  return (
    <Page footerPosition="belowFold">
      <Page.Block gutters width="text">
        <VStack as="main" gap="8" paddingBlock="8 0">
          {!hideSiteTitle && <SoknadHeader />}
          <Outlet />
        </VStack>
      </Page.Block>
    </Page>
  );
}
