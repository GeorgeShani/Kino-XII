import { useSyncExternalStore } from "react";
import type { Movie } from "@/types/api";

export type RecentMovie = Pick<
  Movie,
  | "id"
  | "slug"
  | "title"
  | "posterUrl"
  | "runtimeMinutes"
  | "ageRating"
  | "genres"
>;

const STORAGE_KEY = "kino-recently-viewed";
const MAX_ITEMS = 8;
const EMPTY: RecentMovie[] = [];

const listeners = new Set<() => void>();
let cache: { raw: string | null; items: RecentMovie[] } = {
  raw: null,
  items: EMPTY,
};

function readItems(): RecentMovie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cache.raw) return cache.items;

    const parsed: unknown = JSON.parse(raw ?? "[]");
    cache = { raw, items: Array.isArray(parsed) ? parsed : EMPTY };
    return cache.items;
  } catch {
    return EMPTY;
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function addRecentlyViewed(movie: Movie) {
  const entry: RecentMovie = {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.posterUrl,
    runtimeMinutes: movie.runtimeMinutes,
    ageRating: movie.ageRating,
    genres: movie.genres,
  };
  const items = [
    entry,
    ...readItems().filter((item) => item.slug !== entry.slug),
  ].slice(0, MAX_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    return;
  }
  for (const listener of listeners) listener();
}

export const useRecentlyViewed = () =>
  useSyncExternalStore(subscribe, readItems, () => EMPTY);
