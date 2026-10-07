import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
import { tmdbImage } from "@/lib/utils/tmdb-image";
import type { Movie } from "@/types/api";
import { movieMeta } from "../format";

export function MovieCardBig({ movie }: { movie: Movie }) {
  const href = `/movies/${movie.slug}`;

  return (
    <article className="group flex h-113 w-65 shrink-0 flex-col rounded-[20px] bg-card p-3.5 shadow-card inset-ring-1 inset-ring-transparent transition-[width,box-shadow] duration-300 ease-linear focus-within:w-111.75 focus-within:inset-ring-raised hover:w-111.75 hover:inset-ring-raised">
      <Link href={href} className="flex min-w-0 flex-col">
        <div className="relative h-75 overflow-hidden rounded-[14px] bg-raised transition-[height] duration-300 ease-linear group-focus-within:h-56 group-hover:h-56">
          {movie.posterUrl && (
            <Image
              src={tmdbImage(movie.posterUrl, "w500")}
              alt=""
              fill
              sizes="260px"
              className={cn(
                "object-cover transition-opacity duration-300 ease-linear",
                movie.backdropUrl &&
                  "group-focus-within:opacity-0 group-hover:opacity-0",
              )}
            />
          )}
          {movie.backdropUrl && (
            <Image
              src={tmdbImage(movie.backdropUrl, "w780")}
              alt=""
              fill
              sizes="447px"
              className="object-cover opacity-0 transition-opacity duration-300 ease-linear group-focus-within:opacity-100 group-hover:opacity-100"
            />
          )}
        </div>

        <div className="mt-3 flex flex-col items-start gap-2">
          <div className="flex w-full flex-col gap-2">
            <h3 className="truncate text-h2">{movie.title}</h3>
            <p className="text-body-m text-fg-secondary">{movieMeta(movie)}</p>
          </div>
          <Badge variant="red" size="md">
            {movie.ageRating.code}
          </Badge>
        </div>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-linear group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr]">
          <div className="min-h-0 overflow-hidden">
            <p className="line-clamp-3 pt-3 text-body-m text-fg-secondary">
              {movie.synopsis}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="text-button">From {formatPrice(movie.fromPrice)}</span>
        <Link href={href} className={buttonStyles({ size: "sm" })}>
          Buy Ticket
        </Link>
      </div>
    </article>
  );
}
