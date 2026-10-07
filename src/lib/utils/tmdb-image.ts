export type TmdbSize = "w185" | "w342" | "w500" | "w780" | "w1280" | "original";

export function tmdbImage(url: string, size: TmdbSize) {
  return url.replace(/\/t\/p\/\w+\//, `/t/p/${size}/`);
}
