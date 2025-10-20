import { useQueryClient } from "@tanstack/react-query";

import { getSkjemaAsArbeidsgiverQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";

export function useInvalidateArbeidsgiversSkjemaQuery() {
  const queryClient = useQueryClient();

  return (skjemaId: string) => {
    queryClient.invalidateQueries({
      queryKey: getSkjemaAsArbeidsgiverQuery(skjemaId).queryKey,
    });
  };
}
