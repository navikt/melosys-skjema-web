import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/skjema/arbeidstaker/$id/")({
  beforeLoad: ({ params }) => {
    // Redirect til første steg i arbeidstaker-skjemaet
    throw redirect({
      to: "/skjema/arbeidstaker/$id/utenlandsoppdraget",
      params: { id: params.id },
    });
  },
});
