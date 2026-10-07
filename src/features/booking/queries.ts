import { queryOptions } from "@tanstack/react-query";
import { fetchSeatMap, fetchSession } from "./api";

export const bookingKeys = {
  session: (sessionId: number) => ["booking", "session", sessionId] as const,
  seatMap: (sessionId: number) => ["booking", "seat-map", sessionId] as const,
};

export const bookingSessionQuery = (sessionId: number) =>
  queryOptions({
    queryKey: bookingKeys.session(sessionId),
    queryFn: ({ signal }) => fetchSession(sessionId, signal),
  });

export const seatMapQuery = (sessionId: number) =>
  queryOptions({
    queryKey: bookingKeys.seatMap(sessionId),
    queryFn: ({ signal }) => fetchSeatMap(sessionId, signal),
    staleTime: 0,
    refetchOnMount: "always",
  });
