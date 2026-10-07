import { format, parseISO } from "date-fns";
import type { Movie } from "@/types/api";

export const movieMeta = (
  movie: Pick<Movie, "genres" | "runtimeMinutes">,
): string =>
  [movie.genres[0]?.name, `${movie.runtimeMinutes} min`]
    .filter(Boolean)
    .join(" · ");

export const inCinemasLabel = (releaseDate: string) =>
  `IN CINEMAS ${format(parseISO(releaseDate), "d MMMM").toUpperCase()}`;
