import { createFileRoute } from "@tanstack/react-router";

import { ArbeidstakerPage } from "../pages/arbeidstaker/ArbeidstakerPage.tsx";

export const Route = createFileRoute("/arbeidstaker")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ArbeidstakerPage />;
}
