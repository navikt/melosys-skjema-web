import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/skjema/arbeidstaker")({
  component: () => <Outlet />,
});
