import Image from "next/image";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { MagnifierIcon, PopcornIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
import { tmdbImage } from "@/lib/utils/tmdb-image";
import type { Movie } from "@/types/api";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function HighlightedTitle({ title, query }: { title: string; query: string }) {
  const parts = title.split(new RegExp(`(${escapeRegExp(query)})`, "i"));

  return parts.map((part, index) => (
    <span
      // biome-ignore lint/suspicious/noArrayIndexKey: parts are positional and static
      key={index}
      className={
        part.toLowerCase() === query.toLowerCase()
          ? "text-fg"
          : "text-fg-secondary"
      }
    >
      {part}
    </span>
  ));
}

interface MessageProps {
  icon: React.ReactNode;
  title: string;
  hint: string;
  onNavigate: () => void;
}

function Message({ icon, title, hint, onNavigate }: MessageProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-6 pt-8 pb-7 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-full bg-tint-white [&_svg]:size-5">
        {icon}
      </span>
      <p className="text-label-m">{title}</p>
      <p className="text-body-m text-fg-secondary">{hint}</p>
      <Link
        href="/sessions"
        onClick={onNavigate}
        className={buttonStyles({ variant: "transparent", className: "mt-3" })}
      >
        Browse all sessions
      </Link>
    </div>
  );
}

function ResultRow({
  movie,
  query,
  onNavigate,
}: {
  movie: Movie;
  query: string;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={`/movies/${movie.slug}`}
        onClick={onNavigate}
        data-search-result=""
        className="flex h-18 items-center gap-3.5 rounded-[10px] py-2 pr-5 pl-2.5 outline-none transition-colors duration-200 hover:bg-tint-white focus-visible:bg-tint-white"
      >
        <span className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-raised">
          {movie.posterUrl && (
            <Image
              src={tmdbImage(movie.posterUrl, "w185")}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.75">
          <span className="truncate text-label-m">
            <HighlightedTitle title={movie.title} query={query} />
          </span>
          <span className="text-body-s text-fg-secondary">
            {movie.kind === "event" ? "Event" : "Film"} · {movie.ageRating.code}{" "}
            · {movie.runtimeMinutes} min
          </span>
        </span>
        {movie.isComingSoon ? (
          <span className="shrink-0 text-label-m text-orange">Coming Soon</span>
        ) : (
          <span className="shrink-0 text-label-m">
            from {formatPrice(movie.fromPrice, false)}
          </span>
        )}
      </Link>
    </li>
  );
}

function ResultsSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-1 p-1">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
          key={index}
          className="h-16 rounded-[10px]"
        />
      ))}
    </div>
  );
}

interface SearchPanelProps {
  query: string;
  results: Movie[] | undefined;
  isPending: boolean;
  isSettling: boolean;
  error: unknown;
  onRetry: () => void;
  onNavigate: () => void;
}

export function SearchPanel({
  query,
  results,
  isPending,
  isSettling,
  error,
  onRetry,
  onNavigate,
}: SearchPanelProps) {
  const content = () => {
    if (!query) {
      return (
        <Message
          icon={<PopcornIcon />}
          title="What do you want to watch?"
          hint="Search by title, director or cast"
          onNavigate={onNavigate}
        />
      );
    }

    if (error && !results) {
      return <ErrorState error={error} onRetry={onRetry} />;
    }

    if (isPending || !results || (results.length === 0 && isSettling)) {
      return <ResultsSkeleton />;
    }

    if (results.length === 0) {
      return (
        <Message
          icon={<MagnifierIcon className="size-5" />}
          title={`No results for “${query}”`}
          hint="Check the spelling or try another film or live event."
          onNavigate={onNavigate}
        />
      );
    }

    return (
      <>
        <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5">
          <span className="text-overline text-fg-secondary uppercase">
            Films &amp; events
          </span>
          <span className="text-body-s text-fg-secondary">
            {results.length} {results.length === 1 ? "result" : "results"}
          </span>
        </div>
        <ul
          className={cn(
            "flex flex-col transition-opacity duration-200",
            isSettling && "opacity-60",
          )}
        >
          {results.map((movie) => (
            <ResultRow
              key={movie.id}
              movie={movie}
              query={query}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="absolute top-full right-0 z-40 mt-1.25 w-full rounded-2xl bg-page p-2 text-fg shadow-popover inset-ring-1 inset-ring-raised">
      {content()}
    </div>
  );
}
