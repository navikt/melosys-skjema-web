import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/skjema/arbeidsgiver")({
  component: () => <Outlet />,
});
