import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/types/api";
import { inCinemasLabel, movieMeta } from "../format";
import { MoviePoster } from "./movie-poster";
import { NotifyButton } from "./notify-button";

export function MovieCardMedium({ movie }: { movie: Movie }) {
  return (
    <article className="flex h-40 w-117.5 shrink-0 gap-4.5 rounded-[20px] bg-card p-3.5 shadow-card inset-ring-1 inset-ring-transparent hover:shadow-card-hover hover:inset-ring-raised">
      <Link
        href={`/movies/${movie.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="shrink-0"
      >
        <MoviePoster
          src={movie.posterUrl}
          size="w342"
          sizes="136px"
          className="h-33 w-34 rounded-[14px]"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between pr-4">
        <Link
          href={`/movies/${movie.slug}`}
          className="flex flex-col items-start gap-2"
        >
          <span className="text-label-s text-red">
            {inCinemasLabel(movie.releaseDate)}
          </span>
          <h3 className="w-full truncate text-h3">{movie.title}</h3>
          <p className="text-body-m text-fg-secondary">{movieMeta(movie)}</p>
          <Badge variant="red" size="md">
            {movie.ageRating.code}
          </Badge>
        </Link>
        <NotifyButton slug={movie.slug} notified={movie.isNotified} />
      </div>
    </article>
  );
}
