import { Alert, Heading } from "@navikt/ds-react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { KontekstBanner } from "~/components/KontekstBanner";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/representasjon/radgiverfirma")({
  component: RadgiverfirmaRoute,
  beforeLoad: () => {
    const kontekst = getRepresentasjonKontekst();

    // Redirect til landingsside hvis kontekst mangler eller ikke er RADGIVER-type
    if (!kontekst || kontekst.type !== "RADGIVER") {
      throw redirect({ to: "/" });
    }

    return {
      hideSiteTitle: true,
      kontekst,
    };
  },
});

function RadgiverfirmaRoute() {
  const { t } = useTranslation();
  const { kontekst } = Route.useRouteContext();

  // Burde ikke skje pga beforeLoad guard, men TypeScript vet ikke dette.
  if (!kontekst) return null;

  return (
    <>
      <KontekstBanner kontekst={kontekst} />
      <Heading className="mt-8" level="1" size="large">
        {t("velgRadgiverfirma.tittel")}
      </Heading>
      <Alert className="mt-4" variant="info">
        {t("velgRadgiverfirma.underUtvikling")}
      </Alert>
    </>
  );
}
