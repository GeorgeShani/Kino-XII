import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiResponse, AuthPayload, User } from "@/types/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  avatar?: File;
}

const noRecovery = { skipAuthRecovery: true };

export const fetchCurrentUser = (signal?: AbortSignal) =>
  apiClient
    .get<ApiResponse<User>>("/me", { signal, ...noRecovery })
    .then(unwrap);

export const login = (payload: LoginPayload) =>
  apiClient
    .post<ApiResponse<AuthPayload>>("/login", payload, noRecovery)
    .then(unwrap);

export function register({
  passwordConfirmation,
  avatar,
  ...fields
}: RegisterPayload) {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  body.append("password_confirmation", passwordConfirmation);
  if (avatar) body.append("avatar", avatar);

  return apiClient
    .post<ApiResponse<AuthPayload>>("/register", body, noRecovery)
    .then(unwrap);
}

export const logout = () => apiClient.post("/logout", undefined, noRecovery);
