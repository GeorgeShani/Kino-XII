import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiResponse, Movie } from "@/types/api";

interface ListParams {
  limit?: number;
  signal?: AbortSignal;
}

const list = (path: string, { limit, signal }: ListParams = {}) =>
  apiClient
    .get<ApiResponse<Movie[]>>(path, { params: { limit }, signal })
    .then(unwrap);

export const fetchFeaturedMovies = (signal?: AbortSignal) =>
  list("/movies/featured", { signal });

export const fetchNowPlaying = (params?: ListParams) =>
  list("/movies/now-playing", params);

export const fetchComingSoon = (params?: ListParams) =>
  list("/movies/coming-soon", params);

export const notifyMovie = (slug: string) =>
  apiClient
    .post<ApiResponse<{ movieId: number; subscribed: boolean }>>(
      `/movies/${slug}/notify`,
    )
    .then(unwrap);
