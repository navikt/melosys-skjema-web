import { createFileRoute, redirect } from "@tanstack/react-router";

import { OversiktPage } from "~/pages/oversikt/OversiktPage.tsx";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import { representasjonskontekstSchema } from "~/types/representasjon.ts";

export const Route = createFileRoute("/oversikt/")({
  component: OversiktRoute,
  validateSearch: (search) => representasjonskontekstSchema.parse(search),
  beforeLoad: ({ search }) => {
    // Redirect til landingsside hvis representasjonstype mangler eller er ugyldig
    if (!search.representasjonstype) {
      throw redirect({ to: "/" });
    }

    // Redirect til velg rådgiverfirma hvis RADGIVER men ingen firma valgt
    if (
      search.representasjonstype === Representasjonstype.RADGIVER &&
      !search.radgiverOrgnr
    ) {
      throw redirect({
        to: "/representasjon/velg-radgiverfirma",
      });
    }
  },
});

function OversiktRoute() {
  const search = Route.useSearch();

  // beforeLoad garanterer at representasjonstype finnes her
  return (
    <OversiktPage
      representasjonskontekst={{
        representasjonstype: search.representasjonstype,
        radgiverOrgnr: search.radgiverOrgnr,
      }}
    />
  );
}
