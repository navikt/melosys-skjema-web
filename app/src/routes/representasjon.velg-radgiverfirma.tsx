import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { VelgRadgiverfirmaPage } from "~/pages/representasjon/velg-radgiverfirma/VelgRadgiverfirmaPage.tsx";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

const velgRadgiverfirmaSearchSchema = z.object({
  kontekst: z.literal(Representasjonstype.RADGIVER).optional().catch(undefined),
});

export const Route = createFileRoute("/representasjon/velg-radgiverfirma")({
  component: VelgRadgiverfirmaPage,
  validateSearch: velgRadgiverfirmaSearchSchema,
  beforeLoad: ({ search }) => {
    if (search.kontekst !== Representasjonstype.RADGIVER) {
      throw redirect({ to: "/" });
    }
  },
});
