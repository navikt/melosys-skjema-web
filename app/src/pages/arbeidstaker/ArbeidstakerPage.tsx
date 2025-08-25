import { Heading, HGrid } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";

import { listSkjemaerQueryOptions } from "../../api/queries.ts";

export function ArbeidstakerPage() {
  const skjemaerQuery = useQuery(listSkjemaerQueryOptions());

  if (skjemaerQuery.isLoading) {
    return <div>Laster...</div>;
  }

  return (
    <div>
      <Heading size={"large"}>Mine Søknader</Heading>
      <HGrid>{skjemaerQuery.data}</HGrid>
    </div>
  );
}
