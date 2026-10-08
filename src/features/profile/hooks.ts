import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import {
  fetchTickets,
  refundOrder,
  type TicketFilter,
  updateProfile,
} from "./api";

export const ticketsKeys = {
  all: ["tickets"] as const,
  list: (filter: TicketFilter) => ["tickets", filter] as const,
};

export function useTickets(filter: TicketFilter, enabled = true) {
  return useQuery({
    queryKey: ticketsKeys.list(filter),
    queryFn: ({ signal }) => fetchTickets(filter, signal),
    enabled,
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: setUser,
  });
}

export function useRefundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refundOrder,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ticketsKeys.all }),
  });
}
