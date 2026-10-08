import type { MutateOptions, UseMutationResult } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

export function useSingleFlightMutate<TData, TVariables>(
  mutation: UseMutationResult<TData, Error, TVariables>,
) {
  const inFlight = useRef(false);
  const { mutate } = mutation;

  return useCallback(
    (
      variables: TVariables,
      options?: MutateOptions<TData, Error, TVariables>,
    ) => {
      if (inFlight.current) return;
      inFlight.current = true;

      mutate(variables, {
        ...options,
        onSettled: (...args) => {
          inFlight.current = false;
          options?.onSettled?.(...args);
        },
      });
    },
    [mutate],
  );
}
