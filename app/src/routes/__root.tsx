import { Page, VStack } from "@navikt/ds-react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { SoknadHeader } from "~/components/SoknadHeader";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Page footerPosition="belowFold">
      <ScrollToTop />
      <Page.Block gutters width="text">
        <VStack as="main" gap="8">
          <SoknadHeader />
          <Outlet />
        </VStack>
      </Page.Block>
    </Page>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}
