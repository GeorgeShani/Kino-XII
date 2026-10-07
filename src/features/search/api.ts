import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiResponse, Movie } from "@/types/api";

export const searchMovies = (query: string, signal?: AbortSignal) =>
  apiClient
    .get<ApiResponse<Movie[]>>("/search", { params: { q: query }, signal })
    .then(unwrap);
