import { createFileRoute } from "@tanstack/react-router";

import { UtsendingsperiodeOgLandSteg } from "~/pages/skjema/utsendingsperiode-og-land/UtsendingsperiodeOgLandSteg.tsx";

function UtsendingsperiodeOgLandStegRoute() {
  const { id } = Route.useParams();

  return <UtsendingsperiodeOgLandSteg id={id} />;
}

export const Route = createFileRoute("/skjema/$id/utsendingsperiode-og-land")({
  component: UtsendingsperiodeOgLandStegRoute,
});
