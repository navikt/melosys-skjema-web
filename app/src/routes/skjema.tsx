import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/skjema")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
