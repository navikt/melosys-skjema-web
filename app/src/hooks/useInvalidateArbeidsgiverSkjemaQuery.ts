import { useQueryClient } from "@tanstack/react-query";

import { getSkjemaAsArbeidsgiverQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";

export function useInvalidateArbeidsgiverSkjemaQuery() {
  const queryClient = useQueryClient();

  return (skjemaId: string) => {
    queryClient.invalidateQueries({
      queryKey: getSkjemaAsArbeidsgiverQuery(skjemaId).queryKey,
    });
  };
}
