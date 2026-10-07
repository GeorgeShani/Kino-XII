import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { movieMeta } from "../format";
import type { RecentMovie } from "../recently-viewed";
import { MoviePoster } from "./movie-poster";

export function MovieCardSmall({ movie }: { movie: RecentMovie }) {
  return (
    <Link
      href={`/movies/${movie.slug}`}
      className="flex h-21.75 w-82.25 shrink-0 items-center gap-3 rounded-2xl bg-card p-2.5 inset-ring-1 inset-ring-transparent transition-shadow duration-300 ease-out hover:shadow-card-hover hover:inset-ring-raised"
    >
      <MoviePoster
        src={movie.posterUrl}
        size="w185"
        sizes="87px"
        className="h-16.75 w-21.75 rounded-lg"
      />
      <div className="flex min-w-0 flex-col items-start gap-1">
        <h3 className="w-full truncate text-button uppercase">{movie.title}</h3>
        <p className="text-body-s text-fg-secondary">{movieMeta(movie)}</p>
        <Badge variant="red" size="md">
          {movie.ageRating.code}
        </Badge>
      </div>
    </Link>
  );
}
