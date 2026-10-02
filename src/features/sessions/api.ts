import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiResponse, FilterOptions } from "@/types/api";

export const fetchFilterOptions = (signal?: AbortSignal) =>
  apiClient
    .get<ApiResponse<FilterOptions>>("/filter-options", { signal })
    .then(unwrap);
