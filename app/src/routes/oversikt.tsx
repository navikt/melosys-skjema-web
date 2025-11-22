import { VStack } from "@navikt/ds-react";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { KontekstBanner } from "~/components/KontekstBanner";
import {
  InnsendteSoknaderTabell,
  OversiktInfo,
  SoknadStarter,
  UtkastListe,
} from "~/components/oversikt";
import type { Organisasjon } from "~/types/representasjon";
import {
  getRepresentasjonKontekst,
  setRepresentasjonKontekst,
} from "~/utils/sessionStorage";

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
  const { kontekst } = Route.useRouteContext();

  // Burde ikke skje pga beforeLoad guard, men TypeScript vet ikke dette.
  if (!kontekst) return null;

  const handleArbeidsgiverValgt = (organisasjon: Organisasjon) => {
    setRepresentasjonKontekst({
      ...kontekst,
      arbeidsgiver: organisasjon,
    });
  };

  return (
    <VStack gap="6">
      <KontekstBanner kontekst={kontekst} />
      <OversiktInfo kontekst={kontekst} />
      <UtkastListe kontekst={kontekst} />
      <SoknadStarter
        kontekst={kontekst}
        onArbeidsgiverValgt={handleArbeidsgiverValgt}
      />
      <InnsendteSoknaderTabell kontekst={kontekst} />
    </VStack>
  );
}
