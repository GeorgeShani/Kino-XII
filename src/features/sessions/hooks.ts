import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchFilterOptions, fetchSessions, type SessionsParams } from "./api";

export const filterOptionsQuery = queryOptions({
  queryKey: ["filter-options"],
  queryFn: ({ signal }) => fetchFilterOptions(signal),
  staleTime: Number.POSITIVE_INFINITY,
});

export const useFilterOptions = () => useQuery(filterOptionsQuery);

export const sessionsQuery = (params: SessionsParams) =>
  queryOptions({
    queryKey: ["sessions", params],
    queryFn: ({ signal }) => fetchSessions(params, signal),
    placeholderData: keepPreviousData,
  });

export const useSessions = (params: SessionsParams) =>
  useQuery(sessionsQuery(params));
