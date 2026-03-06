import { useQueryClient } from "@tanstack/react-query";

import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";

export function useInvalidateSkjemaQuery() {
  const queryClient = useQueryClient();

  return async (skjemaId: string) => {
    await queryClient.invalidateQueries({
      queryKey: getSkjemaQuery(skjemaId).queryKey,
    });
  };
}
