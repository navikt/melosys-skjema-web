import { Page, VStack } from "@navikt/ds-react";
import {
  createRootRouteWithContext,
  Outlet,
  useMatches,
} from "@tanstack/react-router";

import { SoknadHeader } from "~/components/SoknadHeader";
import type { RouterContext } from "~/main";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const matches = useMatches();
  const currentMatch = matches.length > 0 ? matches.at(-1) : null;
  const hideSiteTitle = currentMatch?.context?.hideSiteTitle ?? false;

  return (
    <Page footerPosition="belowFold">
      <Page.Block gutters width="md">
        <VStack as="main" gap="8" paddingBlock="8 0">
          {!hideSiteTitle && <SoknadHeader />}
          <Outlet />
        </VStack>
      </Page.Block>
    </Page>
  );
}
