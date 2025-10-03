import { createFileRoute } from "@tanstack/react-router";

import { TilleggsopplysningerSteg } from "~/pages/skjema/arbeidstaker/TilleggsopplysningerSteg.tsx";

export const Route = createFileRoute(
  "/skjema/arbeidstaker/tilleggsopplysninger",
)({
  component: () => <TilleggsopplysningerSteg />,
});
