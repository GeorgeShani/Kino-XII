import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { searchMovies } from "./api";

const DEBOUNCE_MS = 300;

export function useMovieSearch(rawQuery: string) {
  const query = rawQuery.trim();
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  const result = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: ({ signal }) => searchMovies(debouncedQuery, signal),
    enabled: debouncedQuery.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  return {
    ...result,
    query,
    debouncedQuery,
    isSettling: query !== debouncedQuery || result.isFetching,
  };
}
