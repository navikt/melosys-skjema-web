import { Heading, HGrid } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";

import { listSkjemaerQueryOptions } from "~/api/queries.ts";

export function ArbeidstakerPage() {
  const skjemaerQuery = useQuery(listSkjemaerQueryOptions());

  if (skjemaerQuery.isLoading) {
    return <div>Laster...</div>;
  }

  if (skjemaerQuery.isError) {
    return <div>Det oppstod en feil: {`${skjemaerQuery.error}`}</div>;
  }

  const skjemaer = skjemaerQuery.data;

  return (
    <div>
      <Heading size={"large"}>Mine Søknader</Heading>
      <HGrid>{skjemaer}</HGrid>
    </div>
  );
}
