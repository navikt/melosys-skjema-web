import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/skjema/$id")({
  component: SkjemaIdLayout,
});

function SkjemaIdLayout() {
  return <Outlet />;
}
