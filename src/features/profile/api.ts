import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiResponse, Order, User } from "@/types/api";

export type TicketFilter = "upcoming" | "past";

export interface ProfileInput {
  fullName: string;
  mobileNumber: string;
  dateOfBirth: string;
  preferredVenueId: string;
  avatar?: File;
}

export function updateProfile(input: ProfileInput) {
  const body = new FormData();
  body.append("_method", "PUT");
  body.append("fullName", input.fullName);
  body.append("mobileNumber", input.mobileNumber);
  body.append("dateOfBirth", input.dateOfBirth);
  body.append("preferredVenueId", input.preferredVenueId);
  if (input.avatar) body.append("avatar", input.avatar);

  return apiClient.post<ApiResponse<User>>("/profile", body).then(unwrap);
}

export const fetchTickets = (filter: TicketFilter, signal?: AbortSignal) =>
  apiClient
    .get<ApiResponse<Order[]>>("/tickets", { params: { filter }, signal })
    .then(unwrap);

export const refundOrder = (reference: string) =>
  apiClient
    .post<ApiResponse<Order>>(`/orders/${reference}/refund`)
    .then(unwrap);
