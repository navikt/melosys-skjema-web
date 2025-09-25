import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/skjema/")({
  component: () => <Navigate to="/rollevelger" />,
});
