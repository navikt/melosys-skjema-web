import { Alert, Heading } from "@navikt/ds-react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { KontekstBanner } from "~/components/KontekstBanner";
import { getRepresentasjonKontekst } from "~/utils/sessionStorage";

export const Route = createFileRoute("/oversikt")({
  component: OversiktRoute,
  beforeLoad: () => {
    const kontekst = getRepresentasjonKontekst();

    // Redirect til landingsside hvis ingen kontekst er valgt
    if (!kontekst) {
      throw redirect({ to: "/" });
    }

    // Redirect til velg rådgiverfirma hvis RADGIVER men ingen firma valgt
    if (kontekst.type === "RADGIVER" && !kontekst.radgiverfirma) {
      throw redirect({ to: "/representasjon/radgiverfirma" });
    }

    // Redirect til velg person hvis ANNEN_PERSON men ingen person valgt
    if (kontekst.type === "ANNEN_PERSON" && !kontekst.arbeidstaker) {
      throw redirect({ to: "/representasjon/annen-person" });
    }

    return {
      hideSiteTitle: true,
      kontekst,
    };
  },
});

function OversiktRoute() {
  const { t } = useTranslation();
  const { kontekst } = Route.useRouteContext();

  // Burde ikke skje pga beforeLoad guard, men TypeScript vet ikke dette.
  if (!kontekst) return null;

  const getTittel = () => {
    switch (kontekst.type) {
      case "DEG_SELV": {
        return t("oversiktDegSelv.tittel");
      }
      case "ARBEIDSGIVER": {
        return t("oversiktArbeidsgiver.tittel");
      }
      case "RADGIVER": {
        return t("oversiktRadgiver.tittel");
      }
      case "ANNEN_PERSON": {
        return t("oversiktAnnenPerson.tittel");
      }
    }
  };

  const getUnderUtviklingMelding = () => {
    switch (kontekst.type) {
      case "DEG_SELV": {
        return t("oversiktDegSelv.underUtvikling");
      }
      case "ARBEIDSGIVER": {
        return t("oversiktArbeidsgiver.underUtvikling");
      }
      case "RADGIVER": {
        return t("oversiktRadgiver.underUtvikling");
      }
      case "ANNEN_PERSON": {
        return t("oversiktAnnenPerson.underUtvikling");
      }
    }
  };

  return (
    <>
      <KontekstBanner kontekst={kontekst} />
      <Heading className="mt-8" level="1" size="large">
        {getTittel()}
      </Heading>
      <Alert className="mt-4" variant="info">
        {getUnderUtviklingMelding()}
      </Alert>
    </>
  );
}
