import { QueryClient } from "@tanstack/react-query";
import { isApiError } from "@/lib/api/errors";

const MAX_RETRIES = 2;

function shouldRetry(failureCount: number, error: unknown) {
  const transient = isApiError(error, "network") || isApiError(error, "server");
  return transient && failureCount < MAX_RETRIES;
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
      },
    },
  });
}
