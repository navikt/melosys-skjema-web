import { Page } from "@navikt/ds-react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Page footerPosition="belowFold">
      <Page.Block gutters width="xl">
        <Outlet />
      </Page.Block>
    </Page>
  );
}
