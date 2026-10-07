import Link from "next/link";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useIsAgeBlocked } from "@/features/auth/age-gate";
import { MoviePoster } from "@/features/movies/components/movie-poster";
import { useDragScroll } from "@/lib/hooks/use-drag-scroll";
import type { Session, SessionGroup as SessionGroupData } from "@/types/api";
import { SessionTimeCard } from "./session-time-card";

interface SessionGroupProps {
  group: SessionGroupData;
  onSelect: (session: Session) => void;
}

export function SessionGroup({ group, onSelect }: SessionGroupProps) {
  const { movie, sessions } = group;
  const ageBlocked = useIsAgeBlocked(movie.ageRating);
  const href = `/movies/${movie.slug}`;
  const scrollerRef = useRef<HTMLDivElement>(null);
  useDragScroll(scrollerRef);

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex items-center gap-4">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <MoviePoster
            src={movie.posterUrl}
            size="w185"
            sizes="56px"
            className="h-20 w-14 rounded-lg"
          />
        </Link>
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="truncate text-h2">
              <Link href={href}>{movie.title}</Link>
            </h2>
            <Badge variant="red" size="md">
              {movie.ageRating.code}
            </Badge>
          </div>
          <p className="text-body-m text-fg-secondary">
            {movie.runtimeMinutes} min
          </p>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="-mb-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max gap-3">
          {sessions.map((session) => (
            <SessionTimeCard
              key={session.id}
              session={session}
              ageBlocked={ageBlocked}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
