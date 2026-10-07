import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TimerIcon } from "@/components/ui/icons";
import { tmdbImage } from "@/lib/utils/tmdb-image";
import type { MovieDetail } from "@/types/api";
import { MoviePoster } from "../movie-poster";

const HERO_BADGE = "bg-white/10 px-2.5 text-white";

export function MovieHero({ movie }: { movie: MovieDetail }) {
  return (
    <section className="relative isolate flex min-h-141.75 items-end overflow-hidden px-4 pt-32 pb-10.25 text-white sm:px-8 xl:px-15">
      {movie.backdropUrl && (
        <Image
          src={tmdbImage(movie.backdropUrl, "w1280")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 scale-105 object-cover blur-[4px]"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-ink/30 backdrop-blur-[10px]" />

      <div className="flex w-full flex-col items-start gap-8.5 sm:flex-row sm:items-end">
        <MoviePoster
          src={movie.posterUrl}
          size="w500"
          sizes="289px"
          priority
          className="h-93.5 w-72.25 rounded-[14px] shadow-[0_4px_64px_var(--color-shadow)]"
        />

        <div className="flex max-w-145 flex-col items-start gap-3.75 py-2.25">
          <Badge
            variant={movie.isComingSoon ? "orange" : "red"}
            size="lg"
            className="px-2.5"
          >
            {movie.isComingSoon ? "COMING SOON" : "NOW PLAYING"}
          </Badge>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3.75">
              <h1 className="text-display uppercase">{movie.title}</h1>
              <p className="max-w-140 text-body-m">{movie.synopsis}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.75">
              <Badge variant="red" size="lg" className="px-2.5">
                {movie.ageRating.code}
              </Badge>
              <Badge size="lg" icon={<TimerIcon />} className={HERO_BADGE}>
                {movie.runtimeMinutes} Min
              </Badge>
              {movie.formats.map((format) => (
                <Badge key={format.id} size="lg" className={HERO_BADGE}>
                  {format.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
