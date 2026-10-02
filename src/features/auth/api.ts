import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiResponse, User } from "@/types/api";

export const fetchCurrentUser = (signal?: AbortSignal) =>
  apiClient
    .get<ApiResponse<User>>("/me", { signal, skipAuthRecovery: true })
    .then(unwrap);
