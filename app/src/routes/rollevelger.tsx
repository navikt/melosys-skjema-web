import { createFileRoute } from "@tanstack/react-router";

import { RollevelgerPage } from "~/pages/rollevelger/RollevelgerPage";

export const Route = createFileRoute("/rollevelger")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RollevelgerPage />;
}
