import { apiClient, unwrap } from "@/lib/api/client";
import type {
  ApiResponse,
  Order,
  SeatHold,
  SeatMap,
  SessionWithMovie,
  TicketTypeSlug,
} from "@/types/api";

export interface HoldSeatInput {
  seatId: number;
  ticketType: TicketTypeSlug;
}

export interface OrderInput {
  holdId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export const fetchSession = (sessionId: number, signal?: AbortSignal) =>
  apiClient
    .get<ApiResponse<SessionWithMovie>>(`/sessions/${sessionId}`, { signal })
    .then(unwrap);

export const fetchSeatMap = (sessionId: number, signal?: AbortSignal) =>
  apiClient
    .get<ApiResponse<SeatMap>>(`/sessions/${sessionId}/seats`, { signal })
    .then(unwrap);

export const createHold = (sessionId: number, seats: HoldSeatInput[]) =>
  apiClient
    .post<ApiResponse<SeatHold>>(`/sessions/${sessionId}/holds`, { seats })
    .then(unwrap);

export const fetchHold = (holdId: string, signal?: AbortSignal) =>
  apiClient
    .get<ApiResponse<SeatHold>>(`/holds/${holdId}`, {
      signal,
      skipAuthRecovery: true,
    })
    .then(unwrap);

export const releaseHold = (holdId: string) =>
  apiClient.delete(`/holds/${holdId}`, { skipAuthRecovery: true });

export const createOrder = (input: OrderInput) =>
  apiClient.post<ApiResponse<Order>>("/orders", input).then(unwrap);
