import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/oversikt")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
