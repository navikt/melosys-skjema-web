import { useQueryClient } from "@tanstack/react-query";

import { getSkjemaAsArbeidsgiverQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";

export function useInvalidateArbeidsgiversSkjemaQuery() {
  const queryClient = useQueryClient();

  return async (skjemaId: string) => {
    await queryClient.invalidateQueries({
      queryKey: getSkjemaAsArbeidsgiverQuery(skjemaId).queryKey,
    });
  };
}
