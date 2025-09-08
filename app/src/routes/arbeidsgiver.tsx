import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerPage } from "../pages/arbeidstaker/ArbeidstakerPage";

export const Route = createFileRoute("/arbeidsgiver")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ArbeidstakerPage />;
}
