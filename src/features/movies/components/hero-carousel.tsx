"use client";

import { format, parseISO, startOfISOWeek } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import {
  CarouselArrowIcon,
  TicketIcon,
  TimerIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import { tmdbImage } from "@/lib/utils/tmdb-image";
import type { Movie } from "@/types/api";

const AUTOPLAY_MS = 3000;
const SIDE_PADDING = "px-4 sm:px-8 xl:px-16.75";
const HERO_BADGE = "bg-white/10 text-white";

function premiereLabel(releaseDate: string) {
  const weekStart = startOfISOWeek(parseISO(releaseDate));
  return `PREMIERE · WEEK OF ${format(weekStart, "d MMM").toUpperCase()}`;
}

interface HeroSlideProps {
  movie: Movie;
  active: boolean;
  priority: boolean;
  position: string;
}

function HeroSlide({ movie, active, priority, position }: HeroSlideProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: the ARIA carousel pattern uses role="group" for slides
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={position}
      aria-hidden={!active}
      inert={!active}
      className={cn(
        "absolute inset-0 transition-opacity duration-300 ease-out",
        active ? "z-10 opacity-100" : "opacity-0",
      )}
    >
      {movie.backdropUrl && (
        <Image
          src={tmdbImage(movie.backdropUrl, "original")}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-[50%_29%]"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/18 to-black/82" />

      <div
        className={cn(
          "relative flex h-full flex-col justify-end pb-44.75",
          SIDE_PADDING,
        )}
      >
        <div className="flex max-w-145 flex-col gap-4.5">
          <Badge variant="red" size="lg" className="w-fit">
            {premiereLabel(movie.releaseDate)}
          </Badge>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4.5">
              <h2 className="text-display uppercase">{movie.title}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="red" size="lg">
                  {movie.ageRating.code}
                </Badge>
                <Badge size="lg" icon={<TimerIcon />} className={HERO_BADGE}>
                  {movie.runtimeMinutes} Min
                </Badge>
                {movie.formats.map((movieFormat) => (
                  <Badge key={movieFormat.id} size="lg" className={HERO_BADGE}>
                    {movieFormat.name}
                  </Badge>
                ))}
              </div>
              <p className="line-clamp-4 max-w-140 text-body-l">
                {movie.synopsis}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/movies/${movie.slug}`}
                className={buttonStyles({ variant: "primary" })}
              >
                <TicketIcon />
                Buy tickets
              </Link>
              <Link
                href="/sessions"
                className={buttonStyles({
                  variant: "transparent",
                  className:
                    "bg-white/10 text-white enabled:hover:bg-fg-secondary",
                })}
              >
                All sessions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroCarousel({ movies }: { movies: Movie[] }) {
  const count = movies.length;
  const [index, setIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const paused = interacting || pageHidden;

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (count < 2 || paused || reducedMotion) return;

    const timer = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [count, paused, index, goTo]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured films"
      className="relative isolate h-190 overflow-hidden bg-card text-white"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
    >
      <div aria-live={paused ? "polite" : "off"}>
        {movies.map((movie, position) => (
          <HeroSlide
            key={movie.id}
            movie={movie}
            active={position === index}
            priority={position === 0}
            position={`${position + 1} of ${count}`}
          />
        ))}
      </div>

      {count > 1 && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-10.5 z-20 flex items-center gap-6",
            SIDE_PADDING,
          )}
        >
          <div className="flex flex-1 gap-2">
            {movies.map((movie, position) => (
              <button
                key={movie.id}
                type="button"
                aria-label={`Show film ${position + 1}: ${movie.title}`}
                aria-current={position === index}
                onClick={() => goTo(position)}
                className="flex h-6 flex-1 items-center"
              >
                <span
                  className={cn(
                    "h-0.75 w-full rounded-full transition-colors duration-300 ease-out",
                    position === index ? "bg-red" : "bg-white",
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {(["Previous", "Next"] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                aria-label={`${direction} film`}
                onClick={() => goTo(index + (direction === "Next" ? 1 : -1))}
                className="grid size-13.5 place-items-center rounded-full bg-ink/20 transition-[background-color,box-shadow] duration-700 ease-out hover:bg-ink hover:shadow-[0_2px_8px_var(--color-shadow)]"
              >
                <CarouselArrowIcon
                  className={cn(
                    "size-13.5",
                    direction === "Next" && "-scale-x-100",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
