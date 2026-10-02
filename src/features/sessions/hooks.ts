import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchFilterOptions } from "./api";

export const filterOptionsQuery = queryOptions({
  queryKey: ["filter-options"],
  queryFn: ({ signal }) => fetchFilterOptions(signal),
  staleTime: Number.POSITIVE_INFINITY,
});

export const useFilterOptions = () => useQuery(filterOptionsQuery);
