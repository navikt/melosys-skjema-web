import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/skjema/arbeidsgiver/$id/")({
  beforeLoad: ({ params }) => {
    // Redirect til første steg i arbeidsgiver-skjemaet
    throw redirect({
      to: "/skjema/arbeidsgiver/$id/arbeidsgiveren",
      params: { id: params.id },
    });
  },
});
