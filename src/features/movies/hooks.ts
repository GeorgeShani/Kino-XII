import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchComingSoon,
  fetchFeaturedMovies,
  fetchMovie,
  fetchMovieSessions,
  fetchNowPlaying,
  notifyMovie,
} from "./api";

export const moviesKeys = {
  all: ["movies"] as const,
  featured: () => [...moviesKeys.all, "featured"] as const,
  nowPlaying: (limit?: number) =>
    [...moviesKeys.all, "now-playing", limit] as const,
  comingSoon: (limit?: number) =>
    [...moviesKeys.all, "coming-soon", limit] as const,
  detail: (slug: string) => [...moviesKeys.all, "detail", slug] as const,
  sessions: (slug: string, date: string) =>
    [...moviesKeys.detail(slug), "sessions", date] as const,
};

export const featuredMoviesQuery = queryOptions({
  queryKey: moviesKeys.featured(),
  queryFn: ({ signal }) => fetchFeaturedMovies(signal),
});

export const nowPlayingQuery = (limit?: number) =>
  queryOptions({
    queryKey: moviesKeys.nowPlaying(limit),
    queryFn: ({ signal }) => fetchNowPlaying({ limit, signal }),
  });

export const comingSoonQuery = (limit?: number) =>
  queryOptions({
    queryKey: moviesKeys.comingSoon(limit),
    queryFn: ({ signal }) => fetchComingSoon({ limit, signal }),
  });

export const movieQuery = (slug: string) =>
  queryOptions({
    queryKey: moviesKeys.detail(slug),
    queryFn: ({ signal }) => fetchMovie(slug, signal),
  });

export const movieSessionsQuery = (slug: string, date: string) =>
  queryOptions({
    queryKey: moviesKeys.sessions(slug, date),
    queryFn: ({ signal }) => fetchMovieSessions(slug, date, signal),
  });

export const useFeaturedMovies = () => useQuery(featuredMoviesQuery);
export const useNowPlayingMovies = (limit?: number) =>
  useQuery(nowPlayingQuery(limit));
export const useComingSoonMovies = (limit?: number) =>
  useQuery(comingSoonQuery(limit));

export const useMovie = (slug: string) => useQuery(movieQuery(slug));

export function useNotifyMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notifyMovie,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: moviesKeys.all }),
  });
}
