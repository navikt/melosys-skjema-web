import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { OversiktPage } from "~/pages/oversikt/OversiktPage.tsx";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import { VALID_KONTEKST_TYPES } from "~/types/representasjon.ts";

const oversiktSearchSchema = z.object({
  kontekst: z.enum(VALID_KONTEKST_TYPES).optional(),
  radgiverOrgnr: z.coerce.string().optional(),
});

export const Route = createFileRoute("/oversikt/")({
  component: OversiktRoute,
  validateSearch: (search) => oversiktSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    // Redirect til landingsside hvis kontekst mangler eller er ugyldig
    if (!search.kontekst) {
      throw redirect({ to: "/" });
    }

    // Redirect til velg rådgiverfirma hvis RADGIVER men ingen firma valgt
    if (
      search.kontekst === Representasjonstype.RADGIVER &&
      !search.radgiverOrgnr
    ) {
      throw redirect({
        to: "/representasjon/velg-radgiverfirma",
        search: { kontekst: Representasjonstype.RADGIVER },
      });
    }
  },
});

function OversiktRoute() {
  const { kontekst, radgiverOrgnr } = Route.useSearch();

  // beforeLoad garanterer at kontekst finnes her
  return (
    <OversiktPage
      kontekst={{ representasjonstype: kontekst!, radgiverOrgnr }}
    />
  );
}
