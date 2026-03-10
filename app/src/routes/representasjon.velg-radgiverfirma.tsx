import { createFileRoute, redirect } from "@tanstack/react-router";

import { VelgRadgiverfirmaPage } from "~/pages/representasjon/velg-radgiverfirma/VelgRadgiverfirmaPage.tsx";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import { representasjonsKontekstSchema } from "~/types/representasjon.ts";

export const Route = createFileRoute("/representasjon/velg-radgiverfirma")({
  component: VelgRadgiverfirmaPage,
  validateSearch: (search) => representasjonsKontekstSchema.parse(search),
  beforeLoad: ({ search }) => {
    if (search.representasjonstype !== Representasjonstype.RADGIVER) {
      throw redirect({ to: "/" });
    }
  },
});
