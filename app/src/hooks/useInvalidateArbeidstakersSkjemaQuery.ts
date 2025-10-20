import { useQueryClient } from "@tanstack/react-query";

import { getSkjemaAsArbeidstakerQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";

export function useInvalidateArbeidstakersSkjemaQuery() {
  const queryClient = useQueryClient();

  return (skjemaId: string) => {
    queryClient.invalidateQueries({
      queryKey: getSkjemaAsArbeidstakerQuery(skjemaId).queryKey,
    });
  };
}
