import { Page, VStack } from "@navikt/ds-react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { SoknadHeader } from "~/components/SoknadHeader";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Page footerPosition="belowFold">
      <Page.Block gutters width="text">
        <VStack as="main" gap="8">
          <SoknadHeader />
          <Outlet />
        </VStack>
      </Page.Block>
    </Page>
  );
}
